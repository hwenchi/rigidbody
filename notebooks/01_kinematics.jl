### A Pluto.jl notebook ###
# v0.19.45

using Markdown
using InteractiveUtils

# ╔═╡ 00000000-0000-0000-0000-000000000001
begin
	using LinearAlgebra
	using StaticArrays
	using Rotations
	using GeometryBasics
	using WGLMakie
	WGLMakie.activate!()
end

# ╔═╡ 00000000-0000-0000-0000-000000000002
md"""
# Rigid Body Kinematics

This is the first notebook in the series. For now it's just a scaffold /
smoke test: confirm that Pluto + WGLMakie render a live, interactive
(drag-to-orbit) 3D scene in the browser. The actual theory — rotation
representations, angular velocity, world vs. body frame — starts here next.
"""

# ╔═╡ 00000000-0000-0000-0000-000000000003
let
	fig = Figure(size = (600, 450))
	ax = LScene(fig[1, 1], show_axis = true)
	box = GeometryBasics.Rect3f(Point3f(-0.5, -0.5, -0.5), Vec3f(1, 1, 1))
	mesh!(ax, box, color = :steelblue)
	fig
end

# ╔═╡ Cell order:
# ╠═00000000-0000-0000-0000-000000000001
# ╟─00000000-0000-0000-0000-000000000002
# ╠═00000000-0000-0000-0000-000000000003
