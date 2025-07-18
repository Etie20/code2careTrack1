create type language_enum as enum ('FR', 'EN', 'DLA', 'BASSA', 'EWO');

create type reminder_type_enum as enum ('appointment', 'medication');

create type channel_enum as enum ('sms', 'app', 'voice');

create type reminder_status_enum as enum ('active', 'inactive');

create domain email_domain as varchar(255)
    constraint email_domain_check check ((VALUE)::text ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'::text);

create table if not exists patient
(
    id                 serial,
    full_name          varchar(100)                              not null,
    age                integer                                   not null,
    department         varchar(100)                              not null,
    phone_number       varchar(20)                               not null,
    preferred_language language_enum default 'FR'::language_enum not null,  
    created_at         timestamp     default CURRENT_TIMESTAMP,
    email              email_domain                              not null
);

alter table patient
    add constraint patient_pkey
        primary key (id);

alter table patient
    add constraint patient_phone_number_key
        unique (phone_number);

create table if not exists doctor
(
    id           serial,
    full_name    varchar(100) not null,
    specialty    varchar(100),
    phone_number varchar(20),
    created_at   timestamp default CURRENT_TIMESTAMP,
    email        email_domain not null
);

alter table doctor
    add constraint doctor_pkey
        primary key (id);

alter table doctor
    add constraint doctor_phone_number_key
        unique (phone_number);

create table if not exists feedback
(
    id                  serial,
    patient_id          integer                                   not null,
    feedback_text       text,
    feedback_audio_url  text,
    wait_time_min       integer,
    resolution_time_min integer,
    emoji_rating        varchar(10),
    star_rating         integer,
    language            language_enum default 'FR'::language_enum not null,
    submitted_at        timestamp     default CURRENT_TIMESTAMP
);

create index if not exists idx_feedback_patient_id
    on feedback (patient_id);

alter table feedback
    add constraint feedback_pkey
        primary key (id);

alter table feedback
    add constraint feedback_patient_id_fkey
        foreign key (patient_id) references patient
            on delete cascade;

alter table feedback
    add constraint feedback_star_rating_check
        check ((star_rating >= 1) AND (star_rating <= 5));

create table if not exists reminder
(
    id            serial,
    patient_id    integer                                                     not null,
    doctor_id     integer,
    type          reminder_type_enum                                          not null,
    message       text                                                        not null,
    reminder_date timestamp                                                   not null,
    channel       channel_enum         default 'sms'::channel_enum            not null,
    status        reminder_status_enum default 'active'::reminder_status_enum not null,
    language      language_enum        default 'FR'::language_enum            not null
);

create index if not exists idx_reminder_patient_id
    on reminder (patient_id);

create index if not exists idx_reminder_doctor_id
    on reminder (doctor_id);

create index if not exists idx_reminder_date
    on reminder (reminder_date);

alter table reminder
    add constraint reminder_pkey
        primary key (id);

alter table reminder
    add constraint reminder_patient_id_fkey
        foreign key (patient_id) references patient
            on delete cascade;

alter table reminder
    add constraint reminder_doctor_id_fkey
        foreign key (doctor_id) references doctor
            on delete set null;

