package com.resource.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.*;

@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		loadEnvironmentVariables();
		System.setProperty("https.proxyHost", "192.168.65.105");
		System.setProperty("https.proxyPort", "8080");
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
