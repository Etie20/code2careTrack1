rootProject.name = "track1Backend"

include("application",
        "auth",
        "feedBack",
        "notification",
        "common",
        "reminder",
        "analytics",
    )
project(":application").projectDir = file("application")
project(":auth").projectDir = file("auth")
project(":feedBack").projectDir = file("feedBack")
project(":notification").projectDir = file("notification")
project(":common").projectDir = file("common")
project(":reminder").projectDir = file("reminder")
project(":analytics").projectDir = file("analytics")


