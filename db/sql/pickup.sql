CREATE TABLE Users (
    access_token varchar(1000),
    strava_id varchar(1000),
    firstname varchar(100),
    lastname varchar(100),
    auth_email varchar(60),
    strava_email varchar(60),
    profile_medium varchar(8000),
    profile varchar(8000),
    sex varchar(7),
    city varchar(50),
    state varchar(30),
    created_at DATE,
    updated_at DATE
);