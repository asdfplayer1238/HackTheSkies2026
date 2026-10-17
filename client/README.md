# HackTheSkies2026

## Container frame

Tiles and players are drawn in the shared container frame. To move it from the
browser console or other client code, call
`window.setContainerFramePosition(x, y)` with the frame's canvas coordinates.
The server broadcasts the new position to every connected player.