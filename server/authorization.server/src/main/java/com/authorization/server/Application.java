package com.authorization.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.*;

@SpringBootApplication
public class Application {

	public static void main(String[] args) {

		loadEnvironmentVariables();
		SpringApplication.run(Application.class, args);

	}


	private static void loadEnvironmentVariables ()
	{
		try
		{
			System.getProperties().load(new FileInputStream(".env"));
		}
		catch (IOException e) {
			throw new RuntimeException("Environment variables are essential for this app to start\nPlease refer to the docs on loading classmanagementappserver for better clarification");
		}
	}

}
