CREATE TABLE "users" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	"email" TEXT NOT NULL UNIQUE,
	"image" TEXT NOT NULL,
	"password" TEXT NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "sessions" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL UNIQUE,
	"token" TEXT NOT NULL UNIQUE,
	CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "habits" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"name" TEXT NOT NULL,
	"weekdays" TEXT NOT NULL,
	"current_sequence" integer NOT NULL,
	"highest_sequence" integer NOT NULL,
	CONSTRAINT "habits_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "days_habits" (
	"id" serial NOT NULL,
	"habit_id" integer NOT NULL,
	"date" DATE NOT NULL,
	"done" bool NOT NULL,
	CONSTRAINT "days_habits_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "habits" ADD CONSTRAINT "habits_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "days_habits" ADD CONSTRAINT "days_habits_fk0" FOREIGN KEY ("habit_id") REFERENCES "habits"("id");
