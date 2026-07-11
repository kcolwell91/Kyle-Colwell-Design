"""
Phase 2 — Create clean SEED_MASTER body from animated scene.
Preserves originals in SEED_ORIGINAL_REFERENCE; does not touch animation rig.

Run:
  blender --background /path/to/file.blend --python scripts/blender/create_seed_master.py

Env:
  SANCTUARY_BLEND — input/output blend path (default: Desktop sanctuary file)
  REFERENCE_FRAME — frame for closed-seed snapshot (default: 156)
"""

from __future__ import annotations

import json
import os

import bmesh
import bpy
from mathutils import Vector

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BLEND_PATH = os.environ.get(
    "SANCTUARY_BLEND",
    "/Users/kyle/Desktop/sanctuary/sanctuary-prototype-v02-animation.blend",
)
REFERENCE_FRAME = int(os.environ.get("REFERENCE_FRAME", "156"))
BASE_TRIM_FRACTION = float(os.environ.get("BASE_TRIM_FRACTION", "0.28"))
MASTER_NAME = "SEED_Master_Body"
REPORT_PATH = os.path.join(SCRIPT_DIR, "seed_master_phase2_report.json")


def ensure_collection(name: str, *, hide_viewport: bool = False, hide_render: bool = False) -> bpy.types.Collection:
    col = bpy.data.collections.get(name)
    if col is None:
        col = bpy.data.collections.new(name)
        bpy.context.scene.collection.children.link(col)
    col.hide_viewport = hide_viewport
    col.hide_render = hide_render
    return col


def link_exclusive(obj: bpy.types.Object, collection: bpy.types.Collection) -> None:
    for col in list(obj.users_collection):
        col.objects.unlink(obj)
    if obj.name not in collection.objects:
        collection.objects.link(obj)


def duplicate_seed_reference(source_names: list[str], target_col: bpy.types.Collection) -> list[str]:
    """Duplicate seed assembly objects into reference collection (hidden)."""
    created: list[str] = []
    bpy.ops.object.select_all(action="DESELECT")
    for name in source_names:
        obj = bpy.data.objects.get(name)
        if obj is None:
            continue
        obj.select_set(True)
    if not bpy.context.selected_objects:
        return created

    bpy.context.view_layer.objects.active = bpy.context.selected_objects[0]
    bpy.ops.object.duplicate(linked=False)
    for dup in bpy.context.selected_objects:
        dup.name = f"REF_{dup.name.replace('REF_', '')}"
        dup.animation_data_clear()
        dup.hide_viewport = True
        dup.hide_render = True
        link_exclusive(dup, target_col)
        created.append(dup.name)
    bpy.ops.object.select_all(action="DESELECT")
    return created


def trim_seed_base(obj: bpy.types.Object, fraction: float = BASE_TRIM_FRACTION) -> dict:
    """Remove flat contact foot / leg geometry from bottom of seed mesh."""
    stats = {"faces_deleted": 0, "verts_deleted": 0, "fraction": fraction}

    if obj.type != "MESH" or obj.data is None:
        return stats

    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.mode_set(mode="EDIT")
    bm = bmesh.from_edit_mesh(obj.data)
    bm.faces.ensure_lookup_table()
    bm.verts.ensure_lookup_table()

    if not bm.verts:
        bpy.ops.object.mode_set(mode="OBJECT")
        return stats

    z_values = [v.co.z for v in bm.verts]
    z_min = min(z_values)
    z_max = max(z_values)
    height = max(z_max - z_min, 1e-6)
    vert_threshold = z_min + height * fraction
    face_threshold = z_min + height * (fraction * 0.68)

    faces_to_delete = []
    for face in bm.faces:
        center_z = sum(v.co.z for v in face.verts) / len(face.verts)
        min_face_z = min(v.co.z for v in face.verts)
        if center_z <= face_threshold or min_face_z <= vert_threshold:
            faces_to_delete.append(face)

    if faces_to_delete:
        bmesh.ops.delete(bm, geom=faces_to_delete, context="FACES")
        stats["faces_deleted"] = len(faces_to_delete)

    verts = [v for v in bm.verts if v.co.z <= vert_threshold]
    if verts:
        bmesh.ops.delete(bm, geom=verts, context="VERTS")
        stats["verts_deleted"] = len(verts)

    bmesh.update_edit_mesh(obj.data)
    bpy.ops.object.mode_set(mode="OBJECT")
    stats["z_min"] = round(z_min, 5)
    stats["z_max"] = round(z_max, 5)
    stats["height"] = round(height, 5)
    stats["vert_threshold"] = round(vert_threshold, 5)
    return stats


def cap_and_round_seed_base(obj: bpy.types.Object) -> dict:
    """Fill trimmed opening and dome the bottom for organic taper."""
    stats = {"boundary_edges_before": 0, "holes_filled": False, "bevel_edges": 0}

    if obj.type != "MESH" or obj.data is None:
        return stats

    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.mode_set(mode="EDIT")
    bm = bmesh.from_edit_mesh(obj.data)
    bm.verts.ensure_lookup_table()
    bm.edges.ensure_lookup_table()
    bm.faces.ensure_lookup_table()

    if not bm.verts:
        bpy.ops.object.mode_set(mode="OBJECT")
        return stats

    boundary_edges = [edge for edge in bm.edges if edge.is_boundary]
    stats["boundary_edges_before"] = len(boundary_edges)
    if boundary_edges:
        bmesh.ops.holes_fill(bm, edges=boundary_edges, sides=0)
        stats["holes_filled"] = True

    z_values = [v.co.z for v in bm.verts]
    z_min = min(z_values)
    z_max = max(z_values)
    height = max(z_max - z_min, 1e-6)
    rim_height = height * 0.07

    for vert in bm.verts:
        if vert.co.z > z_min + rim_height:
            continue
        t = 1.0 - (vert.co.z - z_min) / rim_height
        t = max(0.0, min(1.0, t))
        xy_len = (vert.co.x * vert.co.x + vert.co.y * vert.co.y) ** 0.5
        if xy_len > 1e-6:
            shrink = 1.0 - t * 0.42
            vert.co.x *= shrink
            vert.co.y *= shrink
        vert.co.z += t * height * 0.018

    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)

    bottom_edges = [
        edge
        for edge in bm.edges
        if all(vert.co.z <= z_min + rim_height * 1.2 for vert in edge.verts)
    ]
    if bottom_edges:
        bmesh.ops.bevel(
            bm,
            geom=bottom_edges,
            offset=height * 0.012,
            segments=3,
            affect="EDGES",
        )
        stats["bevel_edges"] = len(bottom_edges)

    bmesh.update_edit_mesh(obj.data)
    bpy.ops.object.mode_set(mode="OBJECT")
    return stats


def mesh_cleanup(obj: bpy.types.Object) -> dict:
    """Merge doubles, recalc normals, shade smooth."""
    stats = {}
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)

    verts_before = len(obj.data.vertices)
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.mesh.remove_doubles(threshold=0.0001)
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode="OBJECT")
    stats["verts_before"] = verts_before
    stats["verts_after"] = len(obj.data.vertices)
    stats["verts_merged"] = verts_before - stats["verts_after"]

    bpy.ops.object.shade_smooth()
    return stats


def create_evaluated_mesh_duplicate(source: bpy.types.Object, name: str) -> bpy.types.Object:
    """Duplicate source with evaluated modifier stack baked to mesh."""
    depsgraph = bpy.context.evaluated_depsgraph_get()
    eval_obj = source.evaluated_get(depsgraph)
    mesh = bpy.data.meshes.new_from_object(eval_obj, preserve_all_data_layers=False, depsgraph=depsgraph)
    mesh.name = f"{name}_Mesh"
    obj = bpy.data.objects.new(name, mesh)
    obj.matrix_world = source.matrix_world.copy()
    if source.material_slots:
        for slot in source.material_slots:
            if slot.material and slot.material not in obj.data.materials[:]:
                obj.data.materials.append(slot.material)
    return obj


def main() -> None:
    if not bpy.data.filepath and os.path.isfile(BLEND_PATH):
        bpy.ops.wm.open_mainfile(filepath=BLEND_PATH)

    scene = bpy.context.scene
    scene.frame_set(REFERENCE_FRAME)
    bpy.context.view_layer.update()

    source = bpy.data.objects.get("SEED_Core")
    if source is None:
        raise RuntimeError("SEED_Core not found in scene.")

    report: dict = {
        "blend_file": bpy.data.filepath or BLEND_PATH,
        "reference_frame": REFERENCE_FRAME,
        "source_object": source.name,
        "collections_created": [],
        "reference_duplicates": [],
        "master_object": MASTER_NAME,
        "operations": {},
    }

    # --- Collections ---
    ref_col = ensure_collection("SEED_ORIGINAL_REFERENCE", hide_viewport=True, hide_render=True)
    master_col = ensure_collection("SEED_MASTER", hide_viewport=False, hide_render=False)
    report["collections_created"] = [ref_col.name, master_col.name]

    # --- Reference duplicates (entire 01_SEED assembly) ---
    seed_assembly = [
        "SEED_Core",
        "SEED_Petal_01",
        "SEED_Petal_02",
        "SEED_Petal_03",
        "SEED_Petal_04",
        "SEED_Petal_05",
        "HINGE_Petal_01",
        "HINGE_Petal_02",
        "HINGE_Petal_03",
        "HINGE_Petal_04",
        "HINGE_Petal_05",
    ]
    report["reference_duplicates"] = duplicate_seed_reference(seed_assembly, ref_col)

    # --- Remove prior master if re-running ---
    existing = bpy.data.objects.get(MASTER_NAME)
    if existing:
        mesh = existing.data
        bpy.data.objects.remove(existing, do_unlink=True)
        if mesh and mesh.users == 0:
            bpy.data.meshes.remove(mesh)

    # --- Create master from evaluated SEED_Core at reference frame ---
    master = create_evaluated_mesh_duplicate(source, MASTER_NAME)
    master_col.objects.link(master)

    pre_trim = {
        "verts": len(master.data.vertices),
        "faces": len(master.data.polygons),
    }
    report["operations"]["pre_trim_mesh"] = pre_trim

    trim_stats = trim_seed_base(master, BASE_TRIM_FRACTION)
    report["operations"]["trim_leg"] = trim_stats

    cap_stats = cap_and_round_seed_base(master)
    report["operations"]["cap_and_taper_base"] = cap_stats

    cleanup_stats = mesh_cleanup(master)
    report["operations"]["mesh_cleanup"] = cleanup_stats

    # Apply transforms (bake world scale 0.14 at frame 156 into mesh)
    bpy.context.view_layer.objects.active = master
    master.select_set(True)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)

    # Origin near visual center
    bpy.ops.object.origin_set(type="ORIGIN_GEOMETRY", center="BOUNDS")

    # Final stats
    zs = [master.matrix_world.inverted() @ master.matrix_world @ v.co for v in master.data.vertices]
    # local coords after apply
    zs = [v.co.z for v in master.data.vertices]
    xs = [v.co.x for v in master.data.vertices]
    ys = [v.co.y for v in master.data.vertices]
    report["operations"]["final_mesh"] = {
        "verts": len(master.data.vertices),
        "faces": len(master.data.polygons),
        "bounds_local": {
            "x": [round(min(xs), 5), round(max(xs), 5)],
            "y": [round(min(ys), 5), round(max(ys), 5)],
            "z": [round(min(zs), 5), round(max(zs), 5)],
        },
        "materials": [s.material.name if s.material else None for s in master.material_slots],
        "modifiers": [m.type for m in master.modifiers],
    }

    # Save blend + report
    out_blend = bpy.data.filepath or BLEND_PATH
    bpy.ops.wm.save_as_mainfile(filepath=out_blend)

    with open(REPORT_PATH, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    print("=== PHASE 2 SEED MASTER COMPLETE ===")
    print(f"Saved: {out_blend}")
    print(f"Collections: {report['collections_created']}")
    print(f"Reference duplicates: {len(report['reference_duplicates'])}")
    print(f"Master: {MASTER_NAME} — {report['operations']['final_mesh']['verts']} verts")
    print(f"Leg trim: deleted {trim_stats.get('faces_deleted', 0)} faces, {trim_stats.get('verts_deleted', 0)} verts")
    print(f"Report: {REPORT_PATH}")


if __name__ == "__main__":
    main()
