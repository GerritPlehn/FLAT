#include <glad/glad.h>
#include <GLFW/glfw3.h>

void key_callback(GLFWwindow* window, int key, int scancode, int action, int mods)
{
  if (action == GLFW_PRESS)
    glClearColor(255,255,255,0);
	if (action == GLFW_RELEASE)
		glClearColor(0,0,0,0);
}

int main()
{
	glfwInit();
	GLFWwindow* w = glfwCreateWindow(600, 600, "FLAT - Blink", NULL, NULL);
	glfwMakeContextCurrent(w);
	glfwSwapInterval(0);
	gladLoadGLLoader((GLADloadproc)glfwGetProcAddress);
	glViewport(0, 0, 600, 600);
	glfwSetKeyCallback(w, key_callback);
	while(!glfwWindowShouldClose(w))
	{
		glClear(GL_COLOR_BUFFER_BIT);
		glfwSwapBuffers(w);
		glfwWaitEvents();
	}
	glfwTerminate();
}

