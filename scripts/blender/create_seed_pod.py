"""
Luxury organic seed pod — Blender Python generator
Vertical Z-up teardrop. Run:
  blender --background --python scripts/blender/create_seed_pod.py
"""

from __future__ import annotations

import math
import os
import sys

import bpy
import bmesh
from mathutils import Vector, noise

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
EXPORT_PATH = os.path.join(PROJECT_ROOT, "public", "models", "01_seed.glb")
BLEND_PATH = os.path.join(PROJECT_ROOT, "public", "models", "01_seed.blend")

POD_HEIGHT = 1.02
POD_SEGMENTS = 64
POD_RINGS = 96


def pod_radius(t: float) -> float:
    """
    Single-bulge teardrop — one smooth silhouette, no secondary lobes.
    t=0 grounded foot → t=1 soft apex. Monotonic taper above the belly.
    """
    t = max(0.0, min(1.0, t))
    keys = [
        (0.00, 0.246),
        (0.16, 0.264),   # sole fullness peak
        (0.38, 0.236),
        (0.58, 0.178),
        (0.76, 0.098),
        (0.90, 0.048),
        (1.00, 0.022),
    ]
    i = 0
    while i < len(keys) - 2 and t > keys[i + 1][0]:
        i += 1
    a, b = keys[i], keys[min(i + 1, len(keys) - 1)]
    if b[0] == a[0]:
        return a[1]
    k = (t - a[0]) / (b[0] - a[0])
    # Smoothstep — no overshoot between keys
    ease = k * k * (3.0 - 2.0 * k)
    return a[1] + (b[1] - a[1]) * ease


def clear_scene() -> None:
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    for datablocks, remove in (
        (bpy.data.meshes, bpy.data.meshes.remove),
        (bpy.data.materials, bpy.data.materials.remove),
        (bpy.data.lights, bpy.data.lights.remove),
        (bpy.data.cameras, bpy.data.cameras.remove),
        (bpy.data.curves, bpy.data.curves.remove),
    ):
        for block in list(datablocks):
            if block.users == 0:
                remove(block)


def set_principled_input(bsdf, names: tuple[str, ...], value) -> None:
    for name in names:
        if name not in bsdf.inputs:
            continue
        try:
            bsdf.inputs[name].default_value = value
        except TypeError:
            pass
        return


def apply_subtle_asymmetry(bm: bmesh.types.BMesh, height: float) -> None:
    """
    Barely-there irregularity — overall lean + low-freq warp.
    No radial lobes, pinches, or segmented ripples.
    """
    for v in bm.verts:
        x, y, z = v.co.x, v.co.y, v.co.z
        n = noise.noise(Vector((x * 0.55 + 0.2, y * 0.55, z * 0.35)))
        v.co.x = x + n * 0.001 + 0.004
        v.co.y = y + n * 0.0008 + 0.002


def build_pod_bmesh(height: float = POD_HEIGHT) -> bmesh.types.BMesh:
    """Revolve a clean profile around Z — singular sculptural pod."""
    bm = bmesh.new()
    rings: list[list[bmesh.types.BMVert]] = []

    for ri in range(POD_RINGS + 1):
        t = ri / POD_RINGS
        z = t * height
        r = pod_radius(t)
        ring: list[bmesh.types.BMVert] = []
        for si in range(POD_SEGMENTS):
            ang = (si / POD_SEGMENTS) * math.tau
            x = r * math.cos(ang)
            y = r * math.sin(ang)
            ring.append(bm.verts.new((x, y, z)))
        rings.append(ring)

    for ri in range(POD_RINGS):
        for si in range(POD_SEGMENTS):
            sn = (si + 1) % POD_SEGMENTS
            bm.faces.new((rings[ri][si], rings[ri][sn], rings[ri + 1][sn], rings[ri + 1][si]))

    bm.verts.ensure_lookup_table()
    apply_subtle_asymmetry(bm, height)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    return bm


def bmesh_to_object(bm: bmesh.types.BMesh, name: str) -> bpy.types.Object:
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    return obj


def create_seam_curve(angle: float, height: float = POD_HEIGHT) -> bpy.types.Object:
    curve_data = bpy.data.curves.new(f"SeamCurve_{angle:.2f}", type="CURVE")
    curve_data.dimensions = "3D"
    curve_data.resolution_u = 24
    curve_data.bevel_depth = 0.0018
    curve_data.bevel_resolution = 2
    curve_data.fill_mode = "FULL"

    spline = curve_data.splines.new("POLY")
    pts = []
    for i in range(56):
        t = 0.03 + (i / 55.0) * 0.94
        r = pod_radius(t) * 1.002
        pts.append((math.cos(angle) * r, math.sin(angle) * r, t * height))
    spline.points.add(len(pts) - 1)
    for i, p in enumerate(pts):
        spline.points[i].co = (p[0], p[1], p[2], 1.0)

    obj = bpy.data.objects.new(f"Seam_{angle:.2f}", curve_data)
    bpy.context.collection.objects.link(obj)
    return obj


def create_cylinder_bmesh(radius: float, depth: float, segments: int = 48) -> bmesh.types.BMesh:
    bm = bmesh.new()
    bmesh.ops.create_cone(
        bm,
        cap_ends=True,
        cap_tris=False,
        segments=segments,
        radius1=radius,
        radius2=radius,
        depth=depth,
    )
    return bm


def create_torus_bmesh(major_r: float, minor_r: float, major_seg: int = 56, minor_seg: int = 8) -> bmesh.types.BMesh:
    """Torus in XY plane — sits flat on the ground (Z-up)."""
    bm = bmesh.new()
    rings: list[list[bmesh.types.BMVert]] = []
    for mi in range(minor_seg):
        v = (mi / minor_seg) * math.tau
        ring = []
        for ui in range(major_seg):
            u = (ui / major_seg) * math.tau
            x = (major_r + minor_r * math.cos(v)) * math.cos(u)
            y = (major_r + minor_r * math.cos(v)) * math.sin(u)
            z = minor_r * math.sin(v)
            ring.append(bm.verts.new((x, y, z)))
        rings.append(ring)

    for mi in range(minor_seg):
        for ui in range(major_seg):
            un = (ui + 1) % major_seg
            mn = (mi + 1) % minor_seg
            bm.faces.new((rings[mi][ui], rings[mi][un], rings[mn][un], rings[mn][ui]))
    return bm


def create_base_disc() -> bpy.types.Object:
    bm = create_cylinder_bmesh(0.262, 0.018, 48)
    obj = bmesh_to_object(bm, "Pod_Base")
    obj.location = (0.0, 0.0, 0.009)
    return obj


def create_ground_rings() -> list[bpy.types.Object]:
    rings = []
    specs = [(0.295, 0.0022), (0.362, 0.0016)]
    for i, (radius, minor) in enumerate(specs):
        bm = create_torus_bmesh(radius, minor)
        obj = bmesh_to_object(bm, f"Pod_Ring_{i + 1}")
        obj.location = (0.0, 0.0, 0.006 + i * 0.004)
        rings.append(obj)
    return rings


def make_alabaster_material() -> bpy.types.Material:
    mat = bpy.data.materials.new("Alabaster_Shell")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    out = nodes.new("ShaderNodeOutputMaterial")
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    out.location = (420, 0)
    bsdf.location = (80, 0)

    set_principled_input(bsdf, ("Base Color",), (0.925, 0.888, 0.845, 1.0))
    set_principled_input(bsdf, ("Roughness",), 0.42)
    set_principled_input(bsdf, ("Specular IOR Level", "Specular"), 0.45)
    set_principled_input(bsdf, ("Subsurface Weight", "Subsurface"), 0.2)
    set_principled_input(bsdf, ("Subsurface Color",), (0.96, 0.9, 0.84, 1.0))
    set_principled_input(bsdf, ("Subsurface Radius",), (0.8, 0.6, 0.4))
    set_principled_input(bsdf, ("Coat Weight", "Clearcoat"), 0.12)
    set_principled_input(bsdf, ("Coat Roughness", "Clearcoat Roughness"), 0.35)
    set_principled_input(bsdf, ("Sheen Weight", "Sheen"), 0.18)
    set_principled_input(bsdf, ("Metallic",), 0.0)

    links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat


def make_seam_material() -> bpy.types.Material:
    mat = bpy.data.materials.new("Seam_Bronze")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    out = nodes.new("ShaderNodeOutputMaterial")
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    out.location = (420, 0)
    bsdf.location = (80, 0)

    set_principled_input(bsdf, ("Base Color",), (0.62, 0.48, 0.34, 1.0))
    set_principled_input(bsdf, ("Roughness",), 0.46)
    set_principled_input(bsdf, ("Metallic",), 0.72)
    set_principled_input(bsdf, ("Specular IOR Level", "Specular"), 0.55)

    emit = nodes.new("ShaderNodeEmission")
    emit.inputs["Color"].default_value = (0.18, 0.14, 0.08, 1.0)
    emit.inputs["Strength"].default_value = 0.25
    emit.location = (80, -160)

    mix = nodes.new("ShaderNodeMixShader")
    mix.inputs["Fac"].default_value = 0.12
    mix.location = (260, 0)

    links.new(bsdf.outputs["BSDF"], mix.inputs[1])
    links.new(emit.outputs["Emission"], mix.inputs[2])
    links.new(mix.outputs["Shader"], out.inputs["Surface"])
    return mat


def assign_material(obj: bpy.types.Object, mat: bpy.types.Material) -> None:
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)


def setup_world() -> None:
    world = bpy.context.scene.world
    if world is None:
        world = bpy.data.worlds.new("World")
        bpy.context.scene.world = world
    world.use_nodes = True
    nodes = world.node_tree.nodes
    links = world.node_tree.links
    nodes.clear()

    out = nodes.new("ShaderNodeOutputWorld")
    bg = nodes.new("ShaderNodeBackground")
    bg.inputs["Color"].default_value = (0.04, 0.04, 0.04, 1.0)
    bg.inputs["Strength"].default_value = 0.15
    links.new(bg.outputs["Background"], out.inputs["Surface"])

    bpy.context.scene.render.film_transparent = True


def setup_lighting() -> None:
    def add_area(name, loc, energy, size, color):
        light_data = bpy.data.lights.new(name=name, type="AREA")
        light_data.energy = energy
        light_data.color = color
        light_data.size = size
        light_data.shape = "DISK"
        obj = bpy.data.objects.new(name, light_data)
        bpy.context.collection.objects.link(obj)
        obj.location = loc
        direction = Vector((0.0, 0.0, POD_HEIGHT * 0.45)) - Vector(loc)
        obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
        return obj

    add_area("Key_Light", (2.0, -1.8, 2.4), 220.0, 1.4, (1.0, 0.96, 0.9))
    add_area("Fill_Light", (-2.2, -1.2, 1.2), 65.0, 2.0, (0.86, 0.82, 0.76))
    add_area("Rim_Light", (0.4, 2.6, 1.6), 110.0, 0.9, (0.95, 0.88, 0.78))


def setup_camera() -> None:
    cam_data = bpy.data.cameras.new("Seed_Camera")
    cam_data.lens = 65
    cam = bpy.data.objects.new("Seed_Camera", cam_data)
    bpy.context.collection.objects.link(cam)
    target = Vector((0.0, 0.0, POD_HEIGHT * 0.46))
    cam.location = (2.35, -2.55, 0.62)
    direction = target - cam.location
    cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.camera = cam


def parent_seed_objects(objects: list[bpy.types.Object]) -> bpy.types.Object:
    empty = bpy.data.objects.new("Seed_Pod", None)
    bpy.context.collection.objects.link(empty)
    for obj in objects:
        obj.parent = empty
    empty.rotation_euler = (0.0, 0.0, 0.025)
    return empty


def curve_to_mesh(obj: bpy.types.Object) -> bpy.types.Object:
    depsgraph = bpy.context.evaluated_depsgraph_get()
    eval_obj = obj.evaluated_get(depsgraph)
    mesh = bpy.data.meshes.new_from_object(eval_obj)
    mesh.name = obj.name + "_Mesh"
    mesh_obj = bpy.data.objects.new(mesh.name, mesh)
    mesh_obj.matrix_world = obj.matrix_world.copy()
    bpy.context.collection.objects.link(mesh_obj)
    bpy.data.objects.remove(obj, do_unlink=True)
    return mesh_obj


def shade_smooth(obj: bpy.types.Object) -> None:
    if obj.type != "MESH" or obj.data is None:
        return
    for poly in obj.data.polygons:
        poly.use_smooth = True
    if hasattr(obj.data, "use_auto_smooth"):
        obj.data.use_auto_smooth = True
        obj.data.auto_smooth_angle = math.radians(40)


def optimize_for_web() -> None:
    for obj in bpy.context.scene.objects:
        if obj.type == "MESH":
            shade_smooth(obj)


def export_glb(path: str) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format="GLB",
        use_selection=False,
        export_apply=True,
        export_texcoords=True,
        export_normals=True,
        export_tangents=False,
        export_materials="EXPORT",
        export_image_format="AUTO",
        export_cameras=False,
        export_lights=False,
        export_yup=True,
    )


def build_seed_scene() -> bpy.types.Object:
    clear_scene()
    setup_world()

    alabaster = make_alabaster_material()
    seam_mat = make_seam_material()

    pod = bmesh_to_object(build_pod_bmesh(), "Pod_Shell")
    assign_material(pod, alabaster)

    base = create_base_disc()
    assign_material(base, alabaster)

    rings = create_ground_rings()
    for ring in rings:
        assign_material(ring, seam_mat)

    seam_meshes = []
    for angle in [0.35, 2.08, 4.28]:
        seam = create_seam_curve(angle)
        assign_material(seam, seam_mat)
        seam_meshes.append(curve_to_mesh(seam))

    setup_lighting()
    setup_camera()
    optimize_for_web()

    root = parent_seed_objects([pod, base, *rings, *seam_meshes])
    root.location = (0.0, 0.0, 0.0)

    bpy.context.view_layer.objects.active = root
    return root


def main() -> int:
    print("Building vertical seed pod (Z-up)…")
    print(f"Project root: {PROJECT_ROOT}")
    build_seed_scene()
    export_glb(EXPORT_PATH)
    print(f"Exported GLB → {EXPORT_PATH}")

    os.makedirs(os.path.dirname(BLEND_PATH), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)
    print(f"Saved blend → {BLEND_PATH}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
