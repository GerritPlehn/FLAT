# Blink - Free Latency Analysis Toolkit

Simple OpenGL application that switches the window from black to white as long as a key is pressed.

## Building

Depends on GLFW 3.2 and the corresponding [glad](https://glad.dav1d.de/).

`glad.c` needs to be placed into the same directory as this readme file, `glad.h` into `/usr/include/glad/glad.h`

```bash
cmake .
make
```

## Running

```bash
./blink
```
