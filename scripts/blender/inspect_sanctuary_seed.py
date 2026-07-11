"""
Phase 1 — Inspect sanctuary seed animation scene.
Run:
  blender --background /path/to/file.blend --python scripts/blender/inspect_sanctuary_seed.py
"""

from __future__ import annotations

import json
import os
import sys

import bpy

BLEND_PATH = os.environ.get(
    "SANCTUARY_BLEND",
    "/Users/kyle/Desktop/sanctuary/sanctuary-prototype-v02-animation.blend",
)

KEY_FRAMES = [1, 156, 200, 409, 529, 600]


def iter_action_fcurves(action: bpy.types.Action):
    """Yield fcurves from legacy or Blender 5 layered actions."""
    if action.is_action_legacy:
        yield from action.fcurves
        return
    for layer in action.layers:
        for strip in layer.strips:
            for channelbag in strip.channelbags:
                yield from channelbag.fcurves


def obj_info(obj: bpy.types.Object) -> dict:
    info: dict = {
        "name": obj.name,
        "type": obj.type,
        "parent": obj.parent.name if obj.parent else None,
        "collections": [c.name for c in obj.users_collection],
        "visible": obj.visible_get(),
        "hide_viewport": obj.hide_viewport,
        "hide_render": obj.hide_render,
        "location": [round(v, 4) for v in obj.location],
        "scale": [round(v, 4) for v in obj.scale],
    }

    if obj.type == "MESH" and obj.data:
        mesh = obj.data
        info["verts"] = len(mesh.vertices)
        info["faces"] = len(mesh.polygons)
        info["materials"] = [s.material.name if s.material else None for s in obj.material_slots]
        info["modifiers"] = [
            {"name": m.name, "type": m.type, "show_viewport": m.show_viewport}
            for m in obj.modifiers
        ]
        info["shape_keys"] = (
            [kb.name for kb in mesh.shape_keys.key_blocks]
            if mesh.shape_keys
            else []
        )
        info["vertex_groups"] = [vg.name for vg in obj.vertex_groups]

        # World-space bounds
        corners = [obj.matrix_world @ v.co for v in mesh.vertices]
        if corners:
            xs = [c.x for c in corners]
            ys = [c.y for c in corners]
            zs = [c.z for c in corners]
            info["bounds_world"] = {
                "x": [round(min(xs), 4), round(max(xs), 4)],
                "y": [round(min(ys), 4), round(max(ys), 4)],
                "z": [round(min(zs), 4), round(max(zs), 4)],
            }

    if obj.type == "ARMATURE" and obj.data:
        info["bones"] = [b.name for b in obj.data.bones]
        info["pose_bones"] = [pb.name for pb in obj.pose.bones] if obj.pose else []

    if obj.type == "CAMERA":
        info["lens"] = obj.data.lens if obj.data else None

    if obj.type == "LIGHT":
        info["light_type"] = obj.data.type if obj.data else None
        info["energy"] = obj.data.energy if obj.data else None

    info["constraints"] = [
        {"name": c.name, "type": c.type, "target": getattr(c, "target", None)}
        for c in obj.constraints
    ]

    if obj.animation_data:
        ad = obj.animation_data
        info["animation"] = {
            "action": ad.action.name if ad.action else None,
            "nla_tracks": len(ad.nla_tracks),
        }
        if ad.action:
            fcurves = list(iter_action_fcurves(ad.action))
            fc_names = [fc.data_path for fc in fcurves]
            info["animation"]["fcurve_paths"] = sorted(set(fc_names))[:20]
            info["animation"]["fcurve_count"] = len(fcurves)

    return info


def collection_tree() -> list[dict]:
    result = []
    for col in bpy.data.collections:
        result.append(
            {
                "name": col.name,
                "objects": [o.name for o in col.objects],
                "hide_viewport": col.hide_viewport,
                "hide_render": col.hide_render,
                "children": [c.name for c in col.children],
            }
        )
    return result


def action_summary() -> list[dict]:
    actions = []
    for act in bpy.data.actions:
        frame_range = [float("inf"), float("-inf")]
        fcurves = list(iter_action_fcurves(act))
        fcurve_count = len(fcurves)
        data_paths: set[str] = set()
        for fc in fcurves:
            data_paths.add(fc.data_path)
            for kp in fc.keyframe_points:
                frame_range[0] = min(frame_range[0], kp.co.x)
                frame_range[1] = max(frame_range[1], kp.co.x)
        users = [o.name for o in bpy.data.objects if o.animation_data and o.animation_data.action == act]
        actions.append(
            {
                "name": act.name,
                "fcurves": fcurve_count,
                "frame_range": [int(frame_range[0]), int(frame_range[1])] if fcurve_count else None,
                "data_paths_sample": sorted(data_paths)[:15],
                "assigned_to": users[:10],
            }
        )
    return actions


def classify_objects(objects: list[bpy.types.Object]) -> dict[str, list[str]]:
    categories: dict[str, list[str]] = {
        "seed_body": [],
        "roots": [],
        "flower_petals": [],
        "ground_disc": [],
        "cameras": [],
        "lights": [],
        "armatures": [],
        "particles": [],
        "other_meshes": [],
        "empties": [],
        "other": [],
    }

    for obj in objects:
        name = obj.name.lower()
        if obj.type == "CAMERA":
            categories["cameras"].append(obj.name)
        elif obj.type == "LIGHT":
            categories["lights"].append(obj.name)
        elif obj.type == "ARMATURE":
            categories["armatures"].append(obj.name)
        elif obj.type == "EMPTY":
            categories["empties"].append(obj.name)
        elif obj.type == "MESH":
            if "core" in name or (name.startswith("seed_") and "petal" not in name and "root" not in name):
                categories["seed_body"].append(obj.name)
            elif "root" in name:
                categories["roots"].append(obj.name)
            elif "petal" in name or "flower" in name or "bloom" in name:
                categories["flower_petals"].append(obj.name)
            elif "ground" in name or "disc" in name or "floor" in name or "plane" in name:
                categories["ground_disc"].append(obj.name)
            elif "seed_" in name:
                categories["seed_body"].append(obj.name)
            else:
                categories["other_meshes"].append(obj.name)
        elif obj.type in ("PARTICLE_SYSTEM",):
            categories["particles"].append(obj.name)
        else:
            categories["other"].append(f"{obj.name} ({obj.type})")

    return categories


def visibility_at_frame(frame: int) -> dict:
    scene = bpy.context.scene
    scene.frame_set(frame)
    bpy.context.view_layer.update()

    visible_seed = []
    visible_roots = []
    visible_petals = []
    for obj in bpy.data.objects:
        if obj.type != "MESH" or not obj.visible_get():
            continue
        n = obj.name.lower()
        if "petal" in n or "flower" in n:
            visible_petals.append(obj.name)
        elif "root" in n:
            visible_roots.append(obj.name)
        elif "seed" in n or "core" in n:
            visible_seed.append(obj.name)

    return {
        "frame": frame,
        "visible_seed": visible_seed,
        "visible_roots": visible_roots,
        "visible_petals": visible_petals,
    }


def main() -> None:
    if not bpy.data.filepath and os.path.isfile(BLEND_PATH):
        bpy.ops.wm.open_mainfile(filepath=BLEND_PATH)

    scene = bpy.context.scene
    report = {
        "blend_file": bpy.data.filepath or BLEND_PATH,
        "scene_name": scene.name,
        "frame_start": scene.frame_start,
        "frame_end": scene.frame_end,
        "frame_current": scene.frame_current,
        "fps": scene.render.fps,
        "collections": collection_tree(),
        "classification": classify_objects(list(bpy.data.objects)),
        "all_objects": [obj_info(o) for o in sorted(bpy.data.objects, key=lambda o: o.name)],
        "actions": action_summary(),
        "materials": [{"name": m.name, "users": m.users} for m in bpy.data.materials],
        "key_frame_visibility": [visibility_at_frame(f) for f in KEY_FRAMES],
    }

    out_path = os.environ.get(
        "INSPECT_OUT",
        os.path.join(os.path.dirname(__file__), "sanctuary_seed_inspection.json"),
    )
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, default=str)

    print("=== SANCTUARY SEED INSPECTION REPORT ===")
    print(f"File: {report['blend_file']}")
    print(f"Frames: {report['frame_start']}-{report['frame_end']} @ {report['fps']}fps")
    print()
    print("--- Classification ---")
    for cat, names in report["classification"].items():
        if names:
            print(f"  {cat}: {names}")
    print()
    print("--- Collections ---")
    for col in report["collections"]:
        print(f"  {col['name']}: {len(col['objects'])} objects, children={col['children']}")
    print()
    print("--- Actions ---")
    for act in report["actions"]:
        print(f"  {act['name']}: frames {act['frame_range']}, fcurves={act['fcurves']}, users={act['assigned_to']}")
    print()
    print("--- Key Frame Visibility ---")
    for kf in report["key_frame_visibility"]:
        print(f"  f{kf['frame']}: seed={kf['visible_seed']}, roots={kf['visible_roots']}, petals={kf['visible_petals']}")
    print()
    print(f"Full JSON written to: {out_path}")


if __name__ == "__main__":
    main()
