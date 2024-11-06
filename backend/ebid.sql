\echo 'Delete and recreate ebid db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE ebid;
CREATE DATABASE ebid;
\connect ebid

\i ebid-schema.sql

\echo 'Delete and recreate ebid_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE ebid_test;
CREATE DATABASE ebid_test;
\connect ebid_test

\i ebid-schema.sql
