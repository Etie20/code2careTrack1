plugins {
	java
	id("org.springframework.boot") version "3.5.3"
	id("io.spring.dependency-management") version "1.1.7"
}
val springModulithVersion by extra("1.4.1")

group = "com.code2care"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation(project(":common"))
	implementation(project(":auth"))
	implementation(project(":feedBack"))
	implementation(project(":notification"))
	implementation(project(":reminder"))
	implementation(project(":analytics"))
	implementation("org.springframework.modulith:spring-modulith-starter-core")
	implementation("org.springframework.modulith:spring-modulith-starter-jpa")
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.9")
	testImplementation("org.springframework.modulith:spring-modulith-starter-test")


	compileOnly("org.projectlombok:lombok")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	annotationProcessor("org.projectlombok:lombok")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}
dependencyManagement {
	imports {
		mavenBom("org.springframework.modulith:spring-modulith-bom:$springModulithVersion")
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}
