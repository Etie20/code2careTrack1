rootProject.name = "track1Backend"

include(
    "application",
    "auth",
    "feedBack",
    "notification",
    "common",
    "reminder",
    "analytics",
    "donor",
    "bloodUnit",
    "demand"
)
project(":application").projectDir = file("application")
project(":auth").projectDir = file("auth")
project(":feedBack").projectDir = file("feedBack")
project(":notification").projectDir = file("notification")
project(":common").projectDir = file("common")
project(":reminder").projectDir = file("reminder")
project(":analytics").projectDir = file("analytics")
project(":donor").projectDir = file("donor")
project(":bloodUnit").projectDir = file("bloodUnit")
project(":demand").projectDir = file("demand")