Global Film History Web Map

*Includes Code for creating tables in databased and add Geo index
• Designed an elegant single-page web with user-interactive map elements
• Preprocessed data about theaters’ values in Kolkata, Tel Aviv and all films’ information played in these theaters during 1970s, designed well-structured database, created tables, stored these records and created geo index in PostgreSQL 
• Implemented B/S structure under Express framework in NodeJS, linked with database and created dateSelection function for users to submit date filter request in frontend based on SQL query and row_to_json function from PostgreSQL database in backend
• Customized map view in browser using leaflet API by PUG and defined getUniqueType function for automatically assigning each film type a distinct symbol

#================================================================
#In postgre, create database and then in query tool, create table named Mumbai_Theaters, Theater_Film and Films.
CREATE TABLE Mumbai_Theaters
	(
	  Theater_Name character varying(100),
	  Address character varying(200),
  	  Notes character varying(500),
	  Lat numeric,
          Long numeric,
    	  Theater_ID character varying(20)
	);

CREATE TABLE Theater_Film
	(
	  Theater_Name character varying(100),
	  Mar_1_1970 character varying(100),
	  Mar_2_1970 character varying(100),
	  Mar_3_1970 character varying(100),
	  Mar_4_1970 character varying(100),
	  Mar_5_1970 character varying(100),
	  Mar_6_1970 character varying(100),
	  Mar_7_1970 character varying(100),
	  Mar_8_1970 character varying(100),
	  Mar_9_1970 character varying(100),
	  Mar_10_1970 character varying(100),
	  Mar_11_1970 character varying(100),
	  Mar_12_1970 character varying(100),
	  Mar_13_1970 character varying(100),
	  Mar_14_1970 character varying(100),
	  Mar_15_1970 character varying(100),
	  Mar_16_1970 character varying(100),
	  Mar_17_1970 character varying(100),
	  Mar_18_1970 character varying(100),
	  Mar_19_1970 character varying(100),
	  Mar_20_1970 character varying(100),
	  Mar_21_1970 character varying(100),
	  Mar_22_1970 character varying(100),
	  Mar_23_1970 character varying(100),
	  Mar_24_1970 character varying(100),
	  Mar_25_1970 character varying(100),
	  Mar_26_1970 character varying(100),
	  Mar_27_1970 character varying(100),
	  Mar_28_1970 character varying(100),
	  Mar_29_1970 character varying(100),
	  Mar_30_1970 character varying(100),
	  Mar_31_1970 character varying(100)	
	);

CREATE TABLE Films
	(
	  imdb_id character varying(100),
	  title character varying(100),
  	  year numeric,
	  director_Element_Text character varying(200),
	  writers_Element_Text character varying(200),
	  actors character varying(100),
	  country character varying(100),
      	  language character varying(100),
	  runtime character varying(100)
	);
 
CREATE EXTENSION postgis;
ALTER TABLE Mumbai_Theaters
	ADD COLUMN geom geometry(POINT,4326)

UPDATE Mumbai_Theaters SET geom = ST_SetSRID(ST_MakePoint(Long,Lat),4326);
