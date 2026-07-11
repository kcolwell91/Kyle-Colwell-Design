"""Export the sanctuary seed animation to GLB for the website."""

from __future__ import annotations

import bpy
import bmesh
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT = os.environ.get(
    "SEED_GLB_OUT",
    os.path.join(SCRIPT_DIR, "..", "..", "public", "models", "01_seed.glb"),
)
OUT = os.path.abspath(OUT)

# Warm organic seed tones (linear-ish sRGB values)
SEED_BODY_COLOR = (0.62, 0.50, 0.38)
PETAL_COLOR = (0.78, 0.64, 0.52)
BASE_TRIM_FRACTION = 0.28


def set_principled_color(material, color: tuple[float, float, float], roughness: float = 0.68) -> None:
    if material is None or not material.node_tree:
        return
    for node in material.node_tree.nodes:
        if node.type == "BSDF_PRINCIPLED":
            node.inputs["Base Color"].default_value = (*color, 1.0)
            node.inputs["Roughness"].default_value = roughness
            if "Specular IOR Level" in node.inputs:
                node.inputs["Specular IOR Level"].default_value = 0.22
            elif "Specular" in node.inputs:
                node.inputs["Specular"].default_value = 0.22


def trim_seed_base(obj: bpy.types.Object, fraction: float = BASE_TRIM_FRACTION) -> None:
    """Remove the flat contact foot from the dormant seed core mesh."""
    if obj.type != "MESH" or obj.data is None:
        return

    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.mode_set(mode="EDIT")
    bm = bmesh.from_edit_mesh(obj.data)
    bm.faces.ensure_lookup_table()
    bm.verts.ensure_lookup_table()

    if not bm.verts:
        bpy.ops.object.mode_set(mode="OBJECT")
        return

    z_values = [v.co.z for v in bm.verts]
    z_min = min(z_values)
    z_max = max(z_values)
    height = z_max - z_min
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

    verts = [v for v in bm.verts if v.co.z <= vert_threshold]
    if verts:
        bmesh.ops.delete(bm, geom=verts, context="VERTS")

    bmesh.update_edit_mesh(obj.data)
    bpy.ops.object.mode_set(mode="OBJECT")


def cap_and_round_seed_base(obj: bpy.types.Object) -> None:
    """Fill the trimmed opening and dome the bottom for a natural tapered base."""
    if obj.type != "MESH" or obj.data is None:
        return

    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.mode_set(mode="EDIT")
    bm = bmesh.from_edit_mesh(obj.data)
    bm.verts.ensure_lookup_table()
    bm.edges.ensure_lookup_table()
    bm.faces.ensure_lookup_table()

    if not bm.verts:
        bpy.ops.object.mode_set(mode="OBJECT")
        return

    boundary_edges = [edge for edge in bm.edges if edge.is_boundary]
    if boundary_edges:
        bmesh.ops.holes_fill(bm, edges=boundary_edges, sides=0)

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

    bmesh.update_edit_mesh(obj.data)
    bpy.ops.object.mode_set(mode="OBJECT")


def apply_organic_materials() -> None:
    seed_mat = bpy.data.materials.get("MAT_Seed_Bone")
    set_principled_color(seed_mat, SEED_BODY_COLOR, roughness=0.72)

    for obj in bpy.data.objects:
        if obj.type != "MESH" or not obj.name.startswith("SEED_Petal"):
            continue
        for slot in obj.material_slots:
            if slot.material:
                set_principled_color(slot.material, PETAL_COLOR, roughness=0.66)


for obj in list(bpy.data.objects):
    obj.select_set(False)

core = bpy.data.objects.get("SEED_Core")
if core:
    trim_seed_base(core, BASE_TRIM_FRACTION)
    cap_and_round_seed_base(core)

apply_organic_materials()

mesh_objects = [
    o
    for o in bpy.data.objects
    if o.type == "MESH"
    and o.visible_get()
    and o.name.startswith("SEED_")
]

if not mesh_objects:
    raise RuntimeError("No SEED_* mesh objects found in the blend file.")

for obj in mesh_objects:
    obj.select_set(True)

bpy.context.view_layer.objects.active = mesh_objects[0]

os.makedirs(os.path.dirname(OUT), exist_ok=True)

bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    use_selection=True,
    export_apply=True,
    export_animations=True,
    export_skins=True,
    export_morph=True,
    export_materials="EXPORT",
)

print(f"Exported {len(mesh_objects)} SEED mesh object(s) to {OUT}")
for obj in mesh_objects:
    print(f"  - {obj.name}")
