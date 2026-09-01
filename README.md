# rigidbody

Literate development of rigid body simulation theory, from kinematics up
through a general simulation framework, applied to simple geometries and
example scenes (e.g. a leaning stick on a spinning disk).

Built with [Pluto.jl](https://plutojl.org/) notebooks and
[WGLMakie](https://docs.makie.org/stable/explanations/backends/wglmakie)
for live, interactive (drag-to-orbit) 3D visualization during development.
Pluto's static HTML export doubles as the web-deployable artifact.

## Running

```sh
julia --project=. -e 'using Pluto; Pluto.run()'
```

Then open a notebook from `notebooks/`, starting with `01_kinematics.jl`.

## Notebooks

- `01_kinematics.jl` — scaffold / smoke test: confirms Pluto + WGLMakie
  render an interactive 3D scene. Theory content starts here next.
