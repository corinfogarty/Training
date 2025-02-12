--
-- PostgreSQL database dump
--

-- Dumped from database version 14.15 (Homebrew)
-- Dumped by pg_dump version 14.15 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: ContentType; Type: TYPE; Schema: public; Owner: corinfogarty
--

CREATE TYPE public."ContentType" AS ENUM (
    'Resource',
    'Training',
    'Shortcut',
    'Plugin'
);


ALTER TYPE public."ContentType" OWNER TO corinfogarty;

--
-- Name: ResourceType; Type: TYPE; Schema: public; Owner: corinfogarty
--

CREATE TYPE public."ResourceType" AS ENUM (
    'VIDEO',
    'IMAGE',
    'DOCUMENT',
    'LINK'
);


ALTER TYPE public."ResourceType" OWNER TO corinfogarty;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: corinfogarty
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public."Account" OWNER TO corinfogarty;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: corinfogarty
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "defaultImage" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Category" OWNER TO corinfogarty;

--
-- Name: CompletedResource; Type: TABLE; Schema: public; Owner: corinfogarty
--

CREATE TABLE public."CompletedResource" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "resourceId" text NOT NULL,
    "completedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."CompletedResource" OWNER TO corinfogarty;

--
-- Name: Pathway; Type: TABLE; Schema: public; Owner: corinfogarty
--

CREATE TABLE public."Pathway" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdById" text NOT NULL,
    "isPublished" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Pathway" OWNER TO corinfogarty;

--
-- Name: PathwayResource; Type: TABLE; Schema: public; Owner: corinfogarty
--

CREATE TABLE public."PathwayResource" (
    id text NOT NULL,
    "pathwayId" text NOT NULL,
    "resourceId" text NOT NULL,
    "order" integer NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PathwayResource" OWNER TO corinfogarty;

--
-- Name: Resource; Type: TABLE; Schema: public; Owner: corinfogarty
--

CREATE TABLE public."Resource" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    url text NOT NULL,
    "additionalUrls" text[],
    "previewImage" text,
    "categoryId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "contentType" public."ContentType" DEFAULT 'Training'::public."ContentType" NOT NULL,
    "submittedById" text
);


ALTER TABLE public."Resource" OWNER TO corinfogarty;

--
-- Name: ResourceOrder; Type: TABLE; Schema: public; Owner: corinfogarty
--

CREATE TABLE public."ResourceOrder" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "resourceId" text NOT NULL,
    "categoryId" text NOT NULL,
    "order" integer NOT NULL
);


ALTER TABLE public."ResourceOrder" OWNER TO corinfogarty;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: corinfogarty
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO corinfogarty;

--
-- Name: Settings; Type: TABLE; Schema: public; Owner: corinfogarty
--

CREATE TABLE public."Settings" (
    id integer DEFAULT 1 NOT NULL,
    "siteName" text,
    "defaultCategoryId" text,
    "notificationEmail" text,
    "emailEnabled" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Settings" OWNER TO corinfogarty;

--
-- Name: User; Type: TABLE; Schema: public; Owner: corinfogarty
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    name text,
    image text,
    "emailVerified" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isAdmin" boolean DEFAULT false NOT NULL,
    "lastLogin" timestamp(3) without time zone
);


ALTER TABLE public."User" OWNER TO corinfogarty;

--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: corinfogarty
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VerificationToken" OWNER TO corinfogarty;

--
-- Name: _UserCompleted; Type: TABLE; Schema: public; Owner: corinfogarty
--

CREATE TABLE public."_UserCompleted" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_UserCompleted" OWNER TO corinfogarty;

--
-- Name: _UserFavorites; Type: TABLE; Schema: public; Owner: corinfogarty
--

CREATE TABLE public."_UserFavorites" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_UserFavorites" OWNER TO corinfogarty;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: corinfogarty
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO corinfogarty;

--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: corinfogarty
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
cm6yw9tuf0002r7efhwo1b6so	cm6yw9tu30000r7efwif8lk4h	oauth	google	109838525694924757686	\N	ya29.a0AXeO80RWar95ZT-tHtBRiUOC-M7Q9WH3z7g4PpKdLsZHQHEJJZz2LCUvYgEqPln-YbR911-gkkNaUB-4-GDd_kTXeqxifgCG4uBjRpYFc8MdDmVWRWenj2RgFV_4NkGWxy0pJl58oyqrEm31Ulk4Hz-TfbcSlPEcRbIKwrVUKc4aCgYKAWoSARMSFQHGX2MiqQwslFrO277ouNdrM-F0Tg0178	1739185958	Bearer	https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid	eyJhbGciOiJSUzI1NiIsImtpZCI6ImVlYzUzNGZhNWI4Y2FjYTIwMWNhOGQwZmY5NmI1NGM1NjIyMTBkMWUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzNzgyNzAxODIzMDAtY2dvOGVnNHRoa2o4bGVkY2JtMXJkdTFmcGQ2dXNnbWQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIzNzgyNzAxODIzMDAtY2dvOGVnNHRoa2o4bGVkY2JtMXJkdTFmcGQ2dXNnbWQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk4Mzg1MjU2OTQ5MjQ3NTc2ODYiLCJoZCI6Im9scy5kZXNpZ24iLCJlbWFpbCI6ImNvcmluQG9scy5kZXNpZ24iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6InNhT05BV0sxX1VobkY0bWI2TVRremciLCJuYW1lIjoiQ29yaW4gRm9nYXJ0eSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKLWI5dnlzcTdKQXljOTRaaW1BUEQyb2p2aWFjUW1DdFk5UEFmV01FenRIUDloTzZIaD1zOTYtYyIsImdpdmVuX25hbWUiOiJDb3JpbiIsImZhbWlseV9uYW1lIjoiRm9nYXJ0eSIsImlhdCI6MTczOTE4MjM2MCwiZXhwIjoxNzM5MTg1OTYwfQ.0LJiVfc1BvWdHlpZqfrpSsjrvgJUyOl8b7yWnhhJOQ4JgTKtuvV2DVl7nB5Pq6IT08Zc5tTz3neiCjpWnd0mmPafh2NfMOZXrvnnIsUc7y8XMI6OVAeVXkyeNiNSjuD7L7L3t6qdAF_boWvmCnhitl35X8YbVw95qavVxwoAIN-YNzLzUKzuvEKu8TPCl_7UT8OcKL4wtCPkmy1tz2g1QPGgcu_KUlkaoKjC2DO2wBC9r9uS6S5uHVKcdgktHeIfSoaFHnP8hP7UGt9MWEkFt_0cewhfLxjXrJsfyYGVT33f5t7l5KHFSLcZXvpPKvwHVTR2Ss7GVcFQDBaCYSYQDg	\N
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: corinfogarty
--

COPY public."Category" (id, name, description, "defaultImage", "createdAt", "updatedAt", "order") FROM stdin;
cm5mv1fw1004hdjykh8ifk8x9	PHOTOSHOP		\N	2025-01-07 19:25:13.009	2025-01-09 10:05:30.33	0
cm5mv1fu50003djykd7feowfv	BLENDER		\N	2025-01-07 19:25:12.941	2025-01-09 10:05:30.33	1
cm5mv1fvj0036djyka2842mc8	AFTER EFFECTS		\N	2025-01-07 19:25:12.991	2025-01-09 10:05:30.33	2
cm5mv1fv4002bdjykut395pr8	FIGMA		\N	2025-01-07 19:25:12.977	2025-01-09 10:05:30.33	3
cm5mv1fvw0047djykpxp237vj	ILLUSTRATOR		\N	2025-01-07 19:25:13.004	2025-01-09 10:05:30.33	4
cm5mv1fvy004cdjykj6iy08r3	INDESIGN		\N	2025-01-07 19:25:13.006	2025-01-09 10:05:30.33	5
\.


--
-- Data for Name: CompletedResource; Type: TABLE DATA; Schema: public; Owner: corinfogarty
--

COPY public."CompletedResource" (id, "userId", "resourceId", "completedAt") FROM stdin;
\.


--
-- Data for Name: Pathway; Type: TABLE DATA; Schema: public; Owner: corinfogarty
--

COPY public."Pathway" (id, title, description, "createdAt", "updatedAt", "createdById", "isPublished") FROM stdin;
\.


--
-- Data for Name: PathwayResource; Type: TABLE DATA; Schema: public; Owner: corinfogarty
--

COPY public."PathwayResource" (id, "pathwayId", "resourceId", "order", notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Resource; Type: TABLE DATA; Schema: public; Owner: corinfogarty
--

COPY public."Resource" (id, title, description, url, "additionalUrls", "previewImage", "categoryId", "createdAt", "updatedAt", "contentType", "submittedById") FROM stdin;
cm5mv1fvh0031djyk798222yi	Beginner to Pro Class | Unit 6: Basic Prototyping	Learn basic prototyping in Figma	https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons	{}	https://static.figma.com/app/icon/1/icon-192.png	cm5mv1fv4002bdjykut395pr8	2023-10-25 00:00:00	2025-01-08 10:54:56.665	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fw2004jdjykqxqgqxr2	Adobe Photoshop CC - Essentials Training Course	Learn Photoshop essentials	https://www.skillshare.com/en/classes/Adobe-Photoshop-CC-Essentials-Training-Course/1332599607	{}	https://www.adobe.com/content/dam/cc/icons/photoshop.svg	cm5mv1fw1004hdjykh8ifk8x9	2023-08-09 00:00:00	2025-01-08 10:55:06.749	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fv7002hdjyk99jwq8u4	Figma: Beginner to Pro Class | Unit 1: Getting Started	Imported from backup	https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons	{}	https://static.figma.com/app/icon/1/icon-192.png	cm5mv1fv4002bdjykut395pr8	2023-10-25 00:00:00	2025-01-08 10:54:56.348	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fu60005djyk2g0jy0z2	Blender Fast Track Part 1: Minecraft	Imported from backup	https://www.cgfasttrack.com/tutorials/blender-fast-track-vol-1-minecraft-4	{}	https://download.blender.org/branding/blender_logo_socket.png	cm5mv1fu50003djykd7feowfv	2023-08-31 00:00:00	2025-01-08 10:54:56.57	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fw0004gdjykgxbkf5mq	Learn Adobe InDesign: By Creating a Recipe Card	Imported from backup	https://www.skillshare.com/en/classes/Learn-Adobe-InDesign-By-Creating-a-Recipe-Card/920003117?via=search-layout-grid	{}	https://www.adobe.com/content/dam/cc/icons/indesign.svg	cm5mv1fvy004cdjykj6iy08r3	2023-08-11 00:00:00	2025-01-08 10:55:02.762	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fvy004edjykhkqi11b6	Adobe InDesign CC - Essentials Training	Imported from backup	https://www.skillshare.com/en/classes/Adobe-InDesign-CC-Essentials-Training-Course/1170360090/projects?via=search-layout-grid	{}	https://www.dropbox.com/static/metaserver/static/images/opengraph/opengraph-content-icon-file-zip-landscape.png	cm5mv1fvy004cdjykj6iy08r3	2023-08-09 00:00:00	2025-01-08 10:55:06.749	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fub000edjykoh7mv0j6	3D Work	Imported from backup	#pending	{}	https://download.blender.org/branding/blender_logo_socket.png	cm5mv1fu50003djykd7feowfv	2023-01-24 00:00:00	2025-01-08 10:54:56.666	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fv9002ldjykz20dotei	Beginner to Pro Class | Unit 2: Figma Basics	Imported from backup	https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons	{}	https://static.figma.com/app/icon/1/icon-192.png	cm5mv1fv4002bdjykut395pr8	2023-10-25 00:00:00	2025-01-08 10:54:56.774	Training	cm6yw9tu30000r7efwif8lk4h
cm5nsqzuo0001iytnsqhog2go	OLS	Imported from backup	https://ols.design	{}	https://ols.design/012103784.png	cm5mv1fvw0047djykpxp237vj	2025-01-08 11:08:52.608	2025-01-08 11:08:52.608	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fvj0038djykp1epzubx	Learn After Effects in 2 h	Imported from backup	https://www.skillshare.com/en/classes/Learn-After-Effects-In-Only-Two-Hours/1982651597/projects?via=user-profile	{}	https://www.adobe.com/content/dam/cc/icons/aftereffects.svg	cm5mv1fvj0036djyka2842mc8	2023-08-31 00:00:00	2025-01-08 10:54:56.87	Training	cm6yw9tu30000r7efwif8lk4h
cm5nta9av0003iytndbl6j4fi	test	Imported from backup	https://facebook.com	{}	\\N	cm5mv1fvw0047djykpxp237vj	2025-01-08 11:23:51.319	2025-01-08 11:23:51.319	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fuz001wdjykvkyewxas	Blender Fast Track Part 2: Sword in the Stone	Imported from backup	https://www.cgfasttrack.com/tutorials/sword-in-the-stone-4	{}	https://download.blender.org/branding/blender_logo_socket.png	cm5mv1fu50003djykd7feowfv	2023-07-14 00:00:00	2025-01-08 10:54:56.974	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fv00020djyksf72w41q	Blender Fast Track Part 4: UV and Image Projections	Imported from backup	https://www.cgfasttrack.com/tutorials/uv-and-image-projections-in-blender-4-0	{}	https://download.blender.org/branding/blender_logo_socket.png	cm5mv1fu50003djykd7feowfv	2023-07-14 00:00:00	2025-01-08 10:54:57.031	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fuz001ydjykg2dpe5tr	Blender Fast Track Part 3: Modeling Fundamentals	Imported from backup	https://www.cgfasttrack.com/tutorials/fund4-modeling	{}	https://download.blender.org/branding/blender_logo_socket.png	cm5mv1fu50003djykd7feowfv	2023-07-14 00:00:00	2025-01-08 10:54:57.097	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fv10024djyk2upx0ejy	Blender Fast Track Part 6: Animation Fundamentals in Blender	Imported from backup	https://www.cgfasttrack.com/tutorials/blender-animation-fundamentals	{}	https://download.blender.org/branding/blender_logo_socket.png	cm5mv1fu50003djykd7feowfv	2023-07-14 00:00:00	2025-01-08 10:54:57.153	Training	cm6yw9tu30000r7efwif8lk4h
cm5nte7oc0005iytnelwgho9a	seasons greetings	Imported from backup	https://ols.design/landing/seasonsgreetings	{}	https://creative.ols.design/Website/Images/Landing/Share/creators-social.png	cm5mv1fw1004hdjykh8ifk8x9	2025-01-08 11:26:55.835	2025-01-08 11:26:55.835	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fv30028djykh4yk11ss	First Steps with Blender 2.80	Imported from backup	https://www.youtube.com/watch?v=MF1qEhBSfq4&list=PLa1F2ddGya_-UvuAqHAksYnB0qL9yWDO6&index=1	{}	https://i.ytimg.com/vi/MF1qEhBSfq4/maxresdefault.jpg	cm5mv1fu50003djykd7feowfv	2023-07-14 00:00:00	2025-01-08 10:54:57.154	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fvw0049djykfsbhjl28	Fundamentals for Beginners | 1:20 h	Imported from backup	https://www.skillshare.com/en/classes/Learn-Adobe-Illustrator-Fundamentals-for-Beginners/808971532?via=search-layout-grid	{}	https://www.adobe.com/content/dam/cc/icons/illustrator.svg	cm5mv1fvw0047djykpxp237vj	2023-07-28 00:00:00	2025-01-08 10:54:57.247	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fv3002adjykiqk25l4e	Misc Blender Tutorials	Imported from backup	#pending	{}	https://download.blender.org/branding/blender_logo_socket.png	cm5mv1fu50003djykd7feowfv	2024-03-14 00:00:00	2025-01-08 10:54:57.248	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fv20026djyk7d3xw7z6	Blender Fast Track Part 7: The Art of Lighting	Imported from backup	https://www.cgfasttrack.com/tutorials/the-art-of-lighting-in-blender	{}	https://download.blender.org/branding/blender_logo_socket.png	cm5mv1fu50003djykd7feowfv	2023-07-14 00:00:00	2025-01-08 10:54:57.311	Training	cm6yw9tu30000r7efwif8lk4h
cm5nuj7a60007iytnwmv6qvi0	OLS – create MORE!	Imported from backup	https://ols.design/	{}	\\N	cm5mv1fw1004hdjykh8ifk8x9	2025-01-08 11:58:48.223	2025-01-08 11:58:48.223	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fvt0040djyk0iw5lfxr	Motion Beast	Imported from backup	https://motiondesign.school/lessons/introduction-20/	{}	https://cdn.motiondesign.school/uploads/2021/04/cover2.jpg	cm5mv1fvj0036djyka2842mc8	2023-08-11 00:00:00	2025-01-08 10:55:01.643	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fvc002pdjyksbupcqfp	Beginner to Pro Class | Unit 3: Introducing Components	Imported from backup	https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons	{}	https://static.figma.com/app/icon/1/icon-192.png	cm5mv1fv4002bdjykut395pr8	2023-10-25 00:00:00	2025-01-08 10:55:02.084	Training	cm6yw9tu30000r7efwif8lk4h
cm5nuk5y40009iytnvm536d2n	BBC - Home	Imported from backup	https://www.bbc.co.uk/	{}	\\N	cm5mv1fw1004hdjykh8ifk8x9	2025-01-08 11:59:33.149	2025-01-08 11:59:33.149	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fvl003edjykst78ifgz	Text Animators: Custom Text Animation in Adobe After Effects	Imported from backup	https://www.skillshare.com/en/classes/Text-Animators-Custom-Text-Animation-in-Adobe-After-Effects/1739980266?via=search-layout-grid	{}	https://www.adobe.com/content/dam/cc/icons/aftereffects.svg	cm5mv1fvj0036djyka2842mc8	2023-07-28 00:00:00	2025-01-08 10:55:02.481	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fv5002ddjyki19nd1q7	Create a Basic Asset	Imported from backup	https://drive.google.com/drive/folders/1u-C0zOJYEb7oQvwKlYKHQsJ3a-JqILn-	{}	https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/h2NcHyaFQGOZKmI59g3ShG	cm5mv1fv4002bdjykut395pr8	2023-04-28 00:00:00	2025-01-08 10:55:04.3	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fv10022djykzzfhgxau	Blender Fast Track Part 5: Texturing and Shading Fundamentals	Imported from backup	https://www.cgfasttrack.com/tutorials/texturing-and-shading-fundamentals-in-blender-4-0	{}	https://download.blender.org/branding/blender_logo_socket.png	cm5mv1fu50003djykd7feowfv	2023-07-14 00:00:00	2025-01-08 10:55:04.497	Training	cm6yw9tu30000r7efwif8lk4h
cm5nv6073000biytn8p180dbj	Amazon.co.uk: Low Prices in Electronics, Books, Sports Equipment & more	Imported from backup	https://www.amazon.co.uk/	{}	\\N	cm5mv1fw1004hdjykh8ifk8x9	2025-01-08 12:16:32.126	2025-01-08 12:16:32.126	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fvr003wdjykx5ckqczf	11 Expressions for Animation Efficiency in Adobe After Effects | 1:10 h	Imported from backup	https://www.skillshare.com/en/classes/11-Expressions-for-Animation-Efficiency-in-Adobe-After-Effects/451087798?via=search-layout-grid	{}	https://www.adobe.com/content/dam/cc/icons/aftereffects.svg	cm5mv1fvj0036djyka2842mc8	2023-11-24 00:00:00	2025-01-08 10:55:04.591	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fvd002tdjykipke7u4k	Beginner to Pro Class | Unit 4: Variables and Styles	Imported from backup	https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons	{}	https://static.figma.com/app/icon/1/icon-192.png	cm5mv1fv4002bdjykut395pr8	2023-10-25 00:00:00	2025-01-08 10:55:06.86	Training	cm6yw9tu30000r7efwif8lk4h
cm5nv8knn000diytny6r7ao4c	Training Hub	Imported from backup	http://facebook.com	{}		cm5mv1fw1004hdjykh8ifk8x9	2025-01-08 12:18:31.955	2025-01-08 12:19:01.776	Training	cm6yw9tu30000r7efwif8lk4h
cm5nvahi6000fiytnu843lcdl	BBC - Home	Imported from backup	https://www.bbc.co.uk/	{}	https://static.files.bbci.co.uk/core/website/assets/static/webcore/bbc_blocks_84x24.5b565ac136ea8f9cb3b0f8e02eca1e0f.svg	cm5mv1fw1004hdjykh8ifk8x9	2025-01-08 12:20:01.182	2025-01-08 12:20:01.182	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fvf002xdjyk8t9zjjn9	Beginner to Pro Class | Unit 5: Responsive Design	Imported from backup	https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons	{}	https://static.figma.com/app/icon/1/icon-192.png	cm5mv1fv4002bdjykut395pr8	2023-10-25 00:00:00	2025-01-08 10:55:06.952	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fvi0035djykfz3zzqm6	Components 0 to 1 Practice & Cheat Sheet	Imported from backup	https://www.figma.com/file/VTXwD8IniSXgBEjYuFjrvi/Component-Practice-%26-Cheat-Sheet-(Community)?type=design&node-id=1-2&mode=design&t=y00RG2GPpYfas7sO-0	{}	https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/VTXwD8IniSXgBEjYuFjrvi	cm5mv1fv4002bdjykut395pr8	2023-07-14 00:00:00	2025-01-08 10:55:06.954	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fvu0044djyk3ftkh2zg	Fundamentals on UI Animation in After Effects	Imported from backup	https://motiondesign.school/courses/fundamentals-on-ui-animation-in-after-effects/	{}	https://cdn.motiondesign.school/uploads/2021/06/ui_free_title_update.png	cm5mv1fvj0036djyka2842mc8	2023-08-11 00:00:00	2025-01-08 10:55:08.219	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fvo003kdjykps9u3jad	Mocha for Beginners: Screen Replacements | 27 min	Imported from backup	https://www.skillshare.com/en/classes/After-Effects-Mocha-for-Beginners-Screen-Replacements/751144017/lessons	{}	https://www.adobe.com/content/dam/cc/icons/aftereffects.svg	cm5mv1fvj0036djyka2842mc8	2023-11-24 00:00:00	2025-01-08 10:55:08.322	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fvq003sdjykgqax8tfy	Water surface animation for a still image | 5 min	Imported from backup	https://www.youtube.com/watch?v=_J-sOi1iacg	{}	https://i.ytimg.com/vi/_J-sOi1iacg/maxresdefault.jpg	cm5mv1fvj0036djyka2842mc8	2023-11-24 00:00:00	2025-01-08 10:55:08.324	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fvp003odjyk49pr6qxu	Twinkling Stars  | 2 min	Imported from backup	https://www.youtube.com/watch?v=S_kx93-ucWE&t=45s	{}	https://i.ytimg.com/vi/S_kx93-ucWE/maxresdefault.jpg	cm5mv1fvj0036djyka2842mc8	2023-11-24 00:00:00	2025-01-08 10:55:08.325	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fwc005fdjykkbzgcktt	Master Shadows & Lighting in Compositing with Photoshop!	Imported from backup	https://www.youtube.com/watch?v=Da4axkDKzxQ	{}	https://i.ytimg.com/vi/Da4axkDKzxQ/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-07-07 00:00:00	2025-01-08 10:55:08.326	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fw1004jdjyk52gz4t7h	How to make Transparent Glass in Photoshop	Imported from backup	https://www.youtube.com/watch?v=sSDQM_6igQo	{}	https://i.ytimg.com/vi/sSDQM_6igQo/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2024-10-11 00:00:00	2025-01-08 10:55:08.328	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fw4004pdjykswja81h8	3 Ways to Add Depth to Your Composite in Photoshop!	Imported from backup	https://www.youtube.com/watch?v=YqQ6yxclfWA	{}	https://i.ytimg.com/vi/YqQ6yxclfWA/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2023-04-09 00:00:00	2025-01-08 10:55:08.33	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fw2004ldjykwt42foo5	How to Use Sky Replacement Tool effectively	Imported from backup	https://www.youtube.com/watch?v=ognLpUNLDwM	{}	https://i.ytimg.com/vi/ognLpUNLDwM/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2023-09-28 00:00:00	2025-01-08 10:55:08.333	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fw5004tdjykpabnn1ao	How to Create 'Microworlds'	Imported from backup	https://www.youtube.com/watch?v=Z6yXBh7WsKo	{}	https://i.ytimg.com/vi/Z6yXBh7WsKo/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-03-31 00:00:00	2025-01-08 10:55:08.334	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fwi005xdjykclbpl60u	Understanding Depth Of Field	Imported from backup	https://www.skillshare.com/classes/Understanding-Depth-Of-Field/787298081?via=search-layout-grid	{}	https://www.adobe.com/content/dam/cc/us/en/creativecloud/ps_cc_app_RGB.svg	cm5mv1fw1004hdjykh8ifk8x9	2021-03-31 00:00:00	2025-01-08 10:55:08.443	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fwq006jdjyk04kybxce	Changing Colours using HSB Values	Imported from backup	https://www.youtube.com/watch?v=Anto0kf2kuA&t=442s	{}	https://i.ytimg.com/vi/Anto0kf2kuA/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-06-28 00:00:00	2025-01-08 10:55:08.445	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fx5007pdjyk02ibvir6	Realistic Shallow Depth of Field Effect Using Depth Maps	Imported from backup	https://www.youtube.com/watch?v=sKKhuOXwAAk	{}	https://i.ytimg.com/vi/sKKhuOXwAAk/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-03-31 00:00:00	2025-01-08 10:55:08.447	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fwy0071djyk4cb7i8tb	Skillshare: Creating Expert Level Shadows	Imported from backup	https://www.skillshare.com/classes/Photoshop-Like-a-Professional-Creating-Expert-Level-Shadows/1563565830	{}	https://www.adobe.com/content/dam/cc/us/en/creativecloud/ps_cc_app_RGB.svg	cm5mv1fw1004hdjykh8ifk8x9	2021-02-25 00:00:00	2025-01-08 10:55:08.557	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fxb008ddjyk5r2d67qk	Cutout Hair on a black background	Imported from backup	https://youtu.be/G030sJcK9oA	{}	https://i.ytimg.com/vi/G030sJcK9oA/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-04-09 00:00:00	2025-01-08 10:55:08.559	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fxi008zdjyk95ml4a7b	How to Place Anything in Perspective in Photoshop	Imported from backup	https://www.youtube.com/watch?v=7MM2_oVDi_o	{}	https://i.ytimg.com/vi/7MM2_oVDi_o/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-06-09 00:00:00	2025-01-08 10:55:08.561	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fxo009jdjyk2xp565vl	How to stylish highlights in Photoshop CC	Imported from backup	https://www.youtube.com/watch?v=Y-RXsQLvFNQ	{}	https://i.ytimg.com/vi/Y-RXsQLvFNQ/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-04-15 00:00:00	2025-01-08 10:55:08.563	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fxu00a3djykheu969h1	Create Flawless & Seamless Backdrops with Photoshop	Imported from backup	https://www.youtube.com/watch?v=336M9VM5eiI&t=292s	{}	https://i.ytimg.com/vi/336M9VM5eiI/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-03-04 00:00:00	2025-01-08 10:55:08.566	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fy100apdjykkoy5vp4c	Remove Halos from Cutout images	Imported from backup	https://www.youtube.com/watch?v=LNAUh3MfVBs	{}	https://i.ytimg.com/vi/LNAUh3MfVBs/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-05-15 00:00:00	2025-01-08 10:55:08.568	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fy800bbdjykhnwt95sw	How To Draw Perspective Shadow - Drawing Shadows In Perspective	Imported from backup	https://www.youtube.com/watch?v=8XLgmiExAbw	{}	https://i.ytimg.com/vi/8XLgmiExAbw/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-06-16 00:00:00	2025-01-08 10:55:08.571	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fyk00cddjykownrea7a	Video: How to Cut Out Backgrounds and KEEP The Original Shadows	Imported from backup	https://www.youtube.com/watch?v=Q4YVE1NPEfg	{}	https://i.ytimg.com/vi/Q4YVE1NPEfg/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-03-03 00:00:00	2025-01-08 10:55:08.573	Training	cm6yw9tu30000r7efwif8lk4h
cm5mv1fyd00brdjykvw39f6i7	Video: How to create stylish highlights	Imported from backup	https://www.youtube.com/watch?v=yUPIChL7_x8	{}	https://i.ytimg.com/vi/yUPIChL7_x8/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-03-03 00:00:00	2025-01-08 10:55:08.575	Training	cm6yw9tu30000r7efwif8lk4h
\.


--
-- Data for Name: ResourceOrder; Type: TABLE DATA; Schema: public; Owner: corinfogarty
--

COPY public."ResourceOrder" (id, "userId", "resourceId", "categoryId", "order") FROM stdin;
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: corinfogarty
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: Settings; Type: TABLE DATA; Schema: public; Owner: corinfogarty
--

COPY public."Settings" (id, "siteName", "defaultCategoryId", "notificationEmail", "emailEnabled", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: corinfogarty
--

COPY public."User" (id, email, name, image, "emailVerified", "createdAt", "updatedAt", "isAdmin", "lastLogin") FROM stdin;
cm6yw9tu30000r7efwif8lk4h	corin@ols.design	Corin Fogarty	https://lh3.googleusercontent.com/a/ACg8ocJ-b9vysq7JAyc94ZimAPD2ojviacQmCtY9PAfWMEztHP9hO6Hh=s96-c	\N	2025-02-10 10:12:40.396	2025-02-10 10:36:24.456	t	2025-02-10 10:36:24.456
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: corinfogarty
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- Data for Name: _UserCompleted; Type: TABLE DATA; Schema: public; Owner: corinfogarty
--

COPY public."_UserCompleted" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _UserFavorites; Type: TABLE DATA; Schema: public; Owner: corinfogarty
--

COPY public."_UserFavorites" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: corinfogarty
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
3a59b8ef-c9cc-465d-94a7-cdcbe625fa71	0cad359678f41fdaa1d3aa51f5eec954dbd88bcb7048966f86500bd04160c49f	2025-02-10 09:45:34.67833+00	20250107171348_init	\N	\N	2025-02-10 09:45:34.642288+00	1
ddc52212-4c56-4b0c-94e7-819df3b00188	a2d5cbbcd65b6f5f20623a61ca1d3be0192f043dcd15784f0c69d0c5ceb464c3	2025-02-10 09:45:34.681357+00	20250107174325_add_settings_model	\N	\N	2025-02-10 09:45:34.678962+00	1
a27001bb-5951-4747-bb07-2a0e4b5525af	dcdb38ef5f3b33bb728bf23179c4fe57ef704d06c718880869763effc32f60ce	2025-02-10 09:45:34.68428+00	20250107174535_add_category_order	\N	\N	2025-02-10 09:45:34.681825+00	1
b849d7fb-3931-45aa-9356-9b094fadf9aa	b02af6a4aa7a4be15a864b17f7436bc1af82b5ed4d59598dc90bc3bae4542919	2025-02-10 09:45:34.685824+00	20250204162140_update_resource_type_to_content_type	\N	\N	2025-02-10 09:45:34.684642+00	1
cab8d18a-ff12-49a8-a627-631d8f7dc910	0c79cd5aafd2a853128e101dc49f3f608fa8a13e97d513cba4d110f506a33806	2025-02-10 09:45:34.687477+00	20250206165914_add_submitted_by	\N	\N	2025-02-10 09:45:34.686214+00	1
12b770a5-30b1-476a-a1a2-09945a4c1fab	41dcfe2572095ed5167608c8c779a048bdd0e80b90a7e9fc5681db4d2f00e7b1	2025-02-10 09:45:34.688448+00	20250206170000_add_default_submitter	\N	\N	2025-02-10 09:45:34.687844+00	1
3c864a70-8ff5-476c-bfae-0cf9ace4ff3f	f7de352b0509e27e075d48eede48992819c650e911427e41a070dabca3ceed62	2025-02-10 09:45:34.689355+00	20250206170100_add_user_image	\N	\N	2025-02-10 09:45:34.688792+00	1
77169714-1e08-49de-99b9-e92fb7d365bf	a4e4e608261ba4a389e7bd93bf0450f898da03f9e9efc23985f9af8b0b27200e	2025-02-10 09:45:34.690305+00	20250206170200_fix_user_image	\N	\N	2025-02-10 09:45:34.689782+00	1
9acba943-ad13-4a63-a2d4-b627cea39581	07c24db2ab2472ec74c3e2de6d90c476861ead718f2f2120b2e62506a3ab96b6	2025-02-10 09:45:34.692516+00	20250207182049_add_plugin_content_type	\N	\N	2025-02-10 09:45:34.690591+00	1
32714bb8-41f9-4288-afbe-a2bbcc35b326	0916d526d9f2af71046c7aa30b483ee5751641a8448ee66a442bc91e8f00c899	2025-02-10 09:45:34.69771+00	20250208113954_add_pathways	\N	\N	2025-02-10 09:45:34.692985+00	1
254a5d21-4ae0-402c-b4c2-e3e4d313f537	0cad359678f41fdaa1d3aa51f5eec954dbd88bcb7048966f86500bd04160c49f	2025-01-07 18:43:31.332849+00	20250107171348_init	\N	\N	2025-01-07 18:43:31.280195+00	1
16a104ef-8a56-42b5-a018-25f95319b3ed	a2d5cbbcd65b6f5f20623a61ca1d3be0192f043dcd15784f0c69d0c5ceb464c3	2025-01-07 18:43:31.337287+00	20250107174325_add_settings_model	\N	\N	2025-01-07 18:43:31.333712+00	1
c4b851fe-378b-4c1b-9fb9-8636cebc1c7f	dcdb38ef5f3b33bb728bf23179c4fe57ef704d06c718880869763effc32f60ce	2025-01-07 18:43:31.339466+00	20250107174535_add_category_order	\N	\N	2025-01-07 18:43:31.338047+00	1
\.


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: CompletedResource CompletedResource_pkey; Type: CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."CompletedResource"
    ADD CONSTRAINT "CompletedResource_pkey" PRIMARY KEY (id);


--
-- Name: PathwayResource PathwayResource_pkey; Type: CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."PathwayResource"
    ADD CONSTRAINT "PathwayResource_pkey" PRIMARY KEY (id);


--
-- Name: Pathway Pathway_pkey; Type: CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."Pathway"
    ADD CONSTRAINT "Pathway_pkey" PRIMARY KEY (id);


--
-- Name: ResourceOrder ResourceOrder_pkey; Type: CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."ResourceOrder"
    ADD CONSTRAINT "ResourceOrder_pkey" PRIMARY KEY (id);


--
-- Name: Resource Resource_pkey; Type: CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."Resource"
    ADD CONSTRAINT "Resource_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: Settings Settings_pkey; Type: CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."Settings"
    ADD CONSTRAINT "Settings_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: corinfogarty
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: corinfogarty
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: CompletedResource_userId_resourceId_key; Type: INDEX; Schema: public; Owner: corinfogarty
--

CREATE UNIQUE INDEX "CompletedResource_userId_resourceId_key" ON public."CompletedResource" USING btree ("userId", "resourceId");


--
-- Name: PathwayResource_pathwayId_order_key; Type: INDEX; Schema: public; Owner: corinfogarty
--

CREATE UNIQUE INDEX "PathwayResource_pathwayId_order_key" ON public."PathwayResource" USING btree ("pathwayId", "order");


--
-- Name: ResourceOrder_userId_categoryId_idx; Type: INDEX; Schema: public; Owner: corinfogarty
--

CREATE INDEX "ResourceOrder_userId_categoryId_idx" ON public."ResourceOrder" USING btree ("userId", "categoryId");


--
-- Name: ResourceOrder_userId_resourceId_key; Type: INDEX; Schema: public; Owner: corinfogarty
--

CREATE UNIQUE INDEX "ResourceOrder_userId_resourceId_key" ON public."ResourceOrder" USING btree ("userId", "resourceId");


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: corinfogarty
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: corinfogarty
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: corinfogarty
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: corinfogarty
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: _UserCompleted_AB_unique; Type: INDEX; Schema: public; Owner: corinfogarty
--

CREATE UNIQUE INDEX "_UserCompleted_AB_unique" ON public."_UserCompleted" USING btree ("A", "B");


--
-- Name: _UserCompleted_B_index; Type: INDEX; Schema: public; Owner: corinfogarty
--

CREATE INDEX "_UserCompleted_B_index" ON public."_UserCompleted" USING btree ("B");


--
-- Name: _UserFavorites_AB_unique; Type: INDEX; Schema: public; Owner: corinfogarty
--

CREATE UNIQUE INDEX "_UserFavorites_AB_unique" ON public."_UserFavorites" USING btree ("A", "B");


--
-- Name: _UserFavorites_B_index; Type: INDEX; Schema: public; Owner: corinfogarty
--

CREATE INDEX "_UserFavorites_B_index" ON public."_UserFavorites" USING btree ("B");


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CompletedResource CompletedResource_resourceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."CompletedResource"
    ADD CONSTRAINT "CompletedResource_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES public."Resource"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CompletedResource CompletedResource_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."CompletedResource"
    ADD CONSTRAINT "CompletedResource_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PathwayResource PathwayResource_pathwayId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."PathwayResource"
    ADD CONSTRAINT "PathwayResource_pathwayId_fkey" FOREIGN KEY ("pathwayId") REFERENCES public."Pathway"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PathwayResource PathwayResource_resourceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."PathwayResource"
    ADD CONSTRAINT "PathwayResource_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES public."Resource"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Pathway Pathway_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."Pathway"
    ADD CONSTRAINT "Pathway_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ResourceOrder ResourceOrder_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."ResourceOrder"
    ADD CONSTRAINT "ResourceOrder_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ResourceOrder ResourceOrder_resourceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."ResourceOrder"
    ADD CONSTRAINT "ResourceOrder_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES public."Resource"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ResourceOrder ResourceOrder_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."ResourceOrder"
    ADD CONSTRAINT "ResourceOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Resource Resource_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."Resource"
    ADD CONSTRAINT "Resource_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Resource Resource_submittedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."Resource"
    ADD CONSTRAINT "Resource_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _UserCompleted _UserCompleted_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."_UserCompleted"
    ADD CONSTRAINT "_UserCompleted_A_fkey" FOREIGN KEY ("A") REFERENCES public."Resource"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _UserCompleted _UserCompleted_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."_UserCompleted"
    ADD CONSTRAINT "_UserCompleted_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _UserFavorites _UserFavorites_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."_UserFavorites"
    ADD CONSTRAINT "_UserFavorites_A_fkey" FOREIGN KEY ("A") REFERENCES public."Resource"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _UserFavorites _UserFavorites_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: corinfogarty
--

ALTER TABLE ONLY public."_UserFavorites"
    ADD CONSTRAINT "_UserFavorites_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

