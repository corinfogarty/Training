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
cm6qz0kbh0001cz8nim29tl4g	cm6qpbpto0000s7tr09q0tf8t	oauth	google	109838525694924757686	\N	ya29.a0AXeO80RLwD1cXXcVl6z6RU-V0xnNQbUWuiwWE8dwTv6ZM2DSCDk32WJIgwMfC7SZ3yGzOaHe7k55TkdrEKDsAArcdkJ-Gvq9hVXkjm2osQk966U_KhwP4Ye1K3dFyaAPpeI4QaFMliD-3wxKXOx1z3OO6QD9W26bs2o8OLChJgaCgYKAXkSARMSFQHGX2MiSWHkEO6aF7plF73Y916DYQ0177	\N	Bearer	https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email	eyJhbGciOiJSUzI1NiIsImtpZCI6ImZhMDcyZjc1Nzg0NjQyNjE1MDg3YzcxODJjMTAxMzQxZTE4ZjdhM2EiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzNzgyNzAxODIzMDAtY2dvOGVnNHRoa2o4bGVkY2JtMXJkdTFmcGQ2dXNnbWQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIzNzgyNzAxODIzMDAtY2dvOGVnNHRoa2o4bGVkY2JtMXJkdTFmcGQ2dXNnbWQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk4Mzg1MjU2OTQ5MjQ3NTc2ODYiLCJoZCI6Im9scy5kZXNpZ24iLCJlbWFpbCI6ImNvcmluQG9scy5kZXNpZ24iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImlGS3NCTEhXdmxCdjdaZERTd210aHciLCJuYW1lIjoiQ29yaW4gRm9nYXJ0eSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKLWI5dnlzcTdKQXljOTRaaW1BUEQyb2p2aWFjUW1DdFk5UEFmV01FenRIUDloTzZIaD1zOTYtYyIsImdpdmVuX25hbWUiOiJDb3JpbiIsImZhbWlseV9uYW1lIjoiRm9nYXJ0eSIsImlhdCI6MTczODcwMzIzNywiZXhwIjoxNzM4NzA2ODM3fQ.FUTEPSj0xHw4SRnslb08lZ_8NqBd-03VLa3Vt9ens9S77tSkVekQS7JliIe3HCRlhGexl50cS07QPFeGCjaEd2nxEwiHziiLrlxIvQ5Ba7EcBHRgGN3Hyqh8R7FUP2sRpqqGBKB7aKhdEa1rv3xbjvav46vL5Q7nzTo8qCwT8_OH1m4LDeWoy9rcdHwPMNmGx_PKHIR0CfqGHVo8rcwWJeb61CZKc2bjU_lhhxlj_Tg_JeRx8sI-Gv_bw_9gflIHee3CsKRje0NvooCYJnbgPB-1KA8ey3JqhZccVpapXU-ZuPd_5CbUg2_tHRgdPPQleU2v-8FQTmWiA9sxz988Sw	\N
cm6tlkzxz000214exgov0ofqg	cm6tlkwrs000014exwn78tggr	oauth	google	110465291477629003780	\N	ya29.a0AXeO80Q2TH1fqxz55kWUx8b2B5Sg1eYIamd7abvoyzFGf8i5HkeCiMj3u1gYx5THDtyRAZ_tcc2NfwiV-9vNKmC5HSu8JfDtFX7Y7a0EMNlBmQ-1e1vAY-hN4NAgK79gq_L-k1edNBWC4jVsy9J8ySaDjuL14ph0rzS5WDtDaCgYKAUMSARASFQHGX2Mie2rNJgBggvGr6FsyZVyGvA0175	\N	Bearer	openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile	eyJhbGciOiJSUzI1NiIsImtpZCI6ImVlYzUzNGZhNWI4Y2FjYTIwMWNhOGQwZmY5NmI1NGM1NjIyMTBkMWUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzNzgyNzAxODIzMDAtY2dvOGVnNHRoa2o4bGVkY2JtMXJkdTFmcGQ2dXNnbWQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIzNzgyNzAxODIzMDAtY2dvOGVnNHRoa2o4bGVkY2JtMXJkdTFmcGQ2dXNnbWQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTA0NjUyOTE0Nzc2MjkwMDM3ODAiLCJoZCI6InRoZW9ubGluZXN0dWRpby5jbyIsImVtYWlsIjoic3R1ZGlvQHRoZW9ubGluZXN0dWRpby5jbyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoia1VsQl9EZzYzZFFGcExaYVI4X3gtUSIsIm5hbWUiOiJPTFMgQWNjb3VudHMiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTHZodG9HSnNTeTZ0aTFpWmVJME1uamEtdHRCZ2E0VzBOSnVHSlV1SXNkSjBhWjh2cz1zOTYtYyIsImdpdmVuX25hbWUiOiJPTFMiLCJmYW1pbHlfbmFtZSI6IkFjY291bnRzIiwiaWF0IjoxNzM4ODYyMDc0LCJleHAiOjE3Mzg4NjU2NzR9.K8Jh5xaxoxt-QFwwVVfLuGHbwghi3iMqh3hJRMVRanoWG64M54t5zZhEJSBbahQpiz9WMejHgbOsP3oCa9GqEQGUk7t44xISM5ZWRNWrH-7T9ZQnl_tCRG7WUcxcmpKE_m4-nhMaFFazof6p070pKBp1B4VO9aEUoy0b_iD9cXUuwFC7C3fXSXXyeHDEC_Jrm1HVRh4ymTjrjdKgGFD2PB5JX4P8fYn5SWU08UWTk4WV9pXbWGtmoMvm2dduCRmBjFPfjUF8_wL7btX2Ofvzkj5xcLDhsmqeQnpObOUOJajHtdjMyFDTmAyTHmiMQtuUnAxCwQLcsMQArAXry0nJ7A	\N
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: corinfogarty
--

COPY public."Category" (id, name, description, "defaultImage", "createdAt", "updatedAt", "order") FROM stdin;
cm6qp60wi0003mliz5pet2n8a	BLENDER	\N	\N	2025-02-04 16:31:36.211	2025-02-04 16:31:36.211	0
cm6qp60xn002bmliznf4d8g9l	FIGMA	\N	\N	2025-02-04 16:31:36.252	2025-02-04 16:31:36.252	0
cm6qp60y40036mliz49q23x9h	AFTER EFFECTS	\N	\N	2025-02-04 16:31:36.269	2025-02-04 16:31:36.269	0
cm6qp60yj0047mliz1c6uv3en	ILLUSTRATOR	\N	\N	2025-02-04 16:31:36.284	2025-02-04 16:31:36.284	0
cm6qp60yl004cmlizbulcya5p	INDESIGN	\N	\N	2025-02-04 16:31:36.286	2025-02-04 16:31:36.286	0
cm6qp60yo004hmliz8ih5nj6o	PHOTOSHOP	\N	\N	2025-02-04 16:31:36.289	2025-02-04 16:31:36.289	0
cm6qpcfvc000022jnfykgtyc6	AI	Ai tips and tutorials		2025-02-04 16:36:35.543	2025-02-04 16:36:35.543	0
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
cm6xgxvkl000111oby348qi2z	3D effects	Learn how to make things in 3d	2025-02-09 10:15:42.357	2025-02-09 10:15:42.357	cm6qpbpto0000s7tr09q0tf8t	t
\.


--
-- Data for Name: PathwayResource; Type: TABLE DATA; Schema: public; Owner: corinfogarty
--

COPY public."PathwayResource" (id, "pathwayId", "resourceId", "order", notes, "createdAt", "updatedAt") FROM stdin;
cm6xgxvkl000311obed3nd66w	cm6xgxvkl000111oby348qi2z	cm6qp60ye003wmlizyndsdb6o	0		2025-02-09 10:15:42.357	2025-02-09 10:15:42.357
cm6xgxvkl000411ob1st8z1r8	cm6xgxvkl000111oby348qi2z	cm6qp60yr004pmliz0k0dlnz5	1		2025-02-09 10:15:42.357	2025-02-09 10:15:42.357
cm6xgxvkl000511obywmddnon	cm6xgxvkl000111oby348qi2z	cm6qp60yl004emlizqj36r1zr	2		2025-02-09 10:15:42.357	2025-02-09 10:15:42.357
cm6xgxvkl000611obllncpxgk	cm6xgxvkl000111oby348qi2z	cm6qp60yb003omlizryarh70e	3		2025-02-09 10:15:42.357	2025-02-09 10:15:42.357
cm6xgxvkl000711ob4sl8tq3j	cm6xgxvkl000111oby348qi2z	cm6qp60yd003smliz79b7sd5r	4		2025-02-09 10:15:42.357	2025-02-09 10:15:42.357
cm6xgxvkl000811ob7hqd9ibm	cm6xgxvkl000111oby348qi2z	cm6qp612n00brmliz5a4rfdwf	5		2025-02-09 10:15:42.357	2025-02-09 10:15:42.357
\.


--
-- Data for Name: Resource; Type: TABLE DATA; Schema: public; Owner: corinfogarty
--

COPY public."Resource" (id, title, description, url, "additionalUrls", "previewImage", "categoryId", "createdAt", "updatedAt", "contentType", "submittedById") FROM stdin;
cm6qp60xj0022mliz03tp0pvh	Blender Fast Track Part 5: Texturing and Shading Fundamentals	<p>Username: corin@theonline.studio Pass: charlotte</p>\n<p>Texturing and Shading Fundamentals in Blender (Remastered)</p>\n<p>Learn to transform your models to a fully textured and shaded scene by utilizing the shader editor. You'll learn how to create consistent, believable worlds with these production techniques.</p>	https://www.cgfasttrack.com/tutorials/texturing-and-shading-fundamentals-in-blender-4-0	{}	/assets/previews/resource-pwKh0wKDFY23ZWaHsh6S0-preview.png	cm6qp60wi0003mliz5pet2n8a	2023-07-14 00:00:00	2025-02-05 11:53:11.336	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60xg001ymlizwe6bbmnv	Blender Fast Track Part 3: Modeling Fundamentals	<h4>Modeling Fundamentals in Blender (Remastered)</h4>\n<p>Dive deep into the building blocks of 3D. In this series you&rsquo;ll explore Blender&rsquo;s modeling tools and learn essential modeling workflows while you construct a magical environment.</p>\n<p>Username: corin@theonline.studio Pass: charlotte</p>	https://www.cgfasttrack.com/tutorials/fund4-modeling	{}	/assets/previews/resource-cw27TKJV0MPRkSBcHzWGj-preview.png	cm6qp60wi0003mliz5pet2n8a	2023-07-14 00:00:00	2025-02-05 11:52:46.252	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60y9003kmlizs2jpfcdj	Mocha for Beginners: Screen Replacements | 27 min	<p>username: studio@theonlinestudio.co.uk pass: ch4rl0tt3</p>\n<h4>About This Class</h4>\n<p>As a motion graphics artist, there&rsquo;s one request that you will always get: screen replacements! Whether it&rsquo;s a laptop, cellphone, or TV, you need to know how to quickly and accurately track and matte your screen. This short course will help you learn the basics so that you can approach your next screen replacement with confidence!</p>\n<p>This class is for anyone,&nbsp;with at least a little experience in After Effects, who wants to get started using Mocha. This tracking technique has countless applications, and I hope it helps with your compositing workflow!</p>	https://www.skillshare.com/en/classes/After-Effects-Mocha-for-Beginners-Screen-Replacements/751144017/lessons	{}	/assets/previews/resource-6FgvwyNjWFYnIunjZvGjk-preview.png	cm6qp60y40036mliz49q23x9h	2023-11-24 00:00:00	2025-02-05 11:54:42.447	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60xf001wmlizqrnqr0sy	Blender Fast Track Part 2: Sword in the Stone	<p>Username: corin@theonline.studio Pass: charlotte</p>\n<p>Blender Fast Track Vol 2: Sword in the Stone (Remastered)</p>\n<p>Dive deeper into Blender as you build out this epic Sword in the Stone scene. Go through the essentials of polygon modeling, shader nodes, building out an environment, and geometry nodes. Learn the basics while sidestepping the pitfalls of standard tutorials as you build a thrilling fantasy world.</p>	https://www.cgfasttrack.com/tutorials/sword-in-the-stone-4	{}	/assets/previews/resource-a3ow47KSYLWTPcMFkQ4eG-preview.png	cm6qp60wi0003mliz5pet2n8a	2023-07-14 00:00:00	2025-02-05 11:53:01.298	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60xl0026mlizy3zpnpl2	Blender Fast Track Part 7: The Art of Lighting	<p>Username: corin@theonline.studio Pass: charlotte</p>\n<h4>The Art of Lighting in Blender</h4>\n<p>Discover the art of lighting beautiful digital worlds in this introductory series. Learn these powerful artistic techniques and apply them while you create eye-catching renders in this easy-to-follow series.</p>	https://www.cgfasttrack.com/tutorials/the-art-of-lighting-in-blender	{}	/assets/previews/resource-1TramWIDH50dPXIf4n8hC-preview.png	cm6qp60wi0003mliz5pet2n8a	2023-07-14 00:00:00	2025-02-05 11:53:29.999	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60xm0028mlizi2foexwf	First Steps with Blender 2.80	<p>This is how to get started with Blender 2.80</p>	https://www.youtube.com/watch?v=MF1qEhBSfq4&list=PLa1F2ddGya_-UvuAqHAksYnB0qL9yWDO6&index=1	{}	/assets/previews/resource-HmPgnEDvuO_nIV1wBTyh4-preview.png	cm6qp60wi0003mliz5pet2n8a	2023-07-14 00:00:00	2025-02-05 10:44:07.981	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60xk0024mlizsyrzy279	Blender Fast Track Part 6: Animation Fundamentals in Blender	<p><a href="https://app.asana.com/app/asana/-/get_asset?asset_id=1205059302498279" target="_blank" rel="noopener noreferrer">https://app.asana.com/app/asana/-/get_asset?asset_id=1205059302498279</a></p>\n<p><a href="https://www.cgfasttrack.com/tutorials/blender-animation-fundamentals" target="_blank" rel="noopener noreferrer">https://www.cgfasttrack.com/tutorials/blender-animation-fundamentals</a></p>\n<p>Username: corin@theonline.studio Pass: charlotte</p>\n<h4>Animation Fundamentals in Blender</h4>\n<p>Get ready to animate! In this tutorial for animation beginners, you'll learn the basics of keyframing tools. Bring your scenes to life by learning to create believable, dynamic sequences using the principles of animation. Jet kit included!</p>	https://www.cgfasttrack.com/tutorials/blender-animation-fundamentals	{}	/assets/previews/resource-4gI6hkMeKrbiwIdb5Gady-preview.png	cm6qp60wi0003mliz5pet2n8a	2023-07-14 00:00:00	2025-02-05 10:43:23.829	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60xj0020mlizomg835y6	Blender Fast Track Part 4: UV and Image Projections	<p>Username: corin@theonline.studio Pass: charlotte</p>\n<h4>UV and Image Projections in Blender (Remastered)</h4>\n<p>Learn a quick way to apply 2D image textures to your 3D models using flat and box image projection techniques. Gain more control over your image textures by learning the fundamentals of UV unwrapping workflows.</p>	https://www.cgfasttrack.com/tutorials/uv-and-image-projections-in-blender-4-0	{}	/assets/previews/resource-DVDcOZhLDXZj0mxYydBiO-preview.png	cm6qp60wi0003mliz5pet2n8a	2023-07-14 00:00:00	2025-02-05 11:53:20.504	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60yk0049mlizjf87x85f	Fundamentals for Beginners | 1:20 h	<p><a href="https://www.skillshare.com/en/classes/Learn-Adobe-Illustrator-Fundamentals-for-Beginners/808971532?via=search-layout-grid" target="_blank" rel="noopener noreferrer">https://www.skillshare.com/en/classes/Learn-Adobe-Illustrator-Fundamentals-for-Beginners/808971532?via=search-layout-grid</a></p>\n<p>username: studio@theonlinestudio.co.uk pass: ch4rl0tt3</p>\n<h4>About This Class</h4>\n<p>Want to create clean and professional graphics? Learn how with designer Anne Bracker in this beginner&rsquo;s guide to Adobe Illustrator!</p>\n<p>In this concise and comprehensive introduction, Anne walks you through everything you need to know in order to get started with Adobe Illustrator. You&rsquo;ll learn&nbsp;how to&nbsp;customize your workspace and speed up your workflow with keyboard shortcuts, then you'll dive straight into the three core elements of Illustrator: shapes, paths and type. By the end of the class, you&rsquo;ll have the essential tools and techniques needed to create any type of graphic. Key skills include:</p>\n<p>Building objects with simple shapes Applying colors and creating swatches Drawing curves with the Pen Tool Making designs with custom type Whether you&rsquo;re opening up Illustrator for the first time or&nbsp;need a refresher on the basics, this class is for you. By the end, you&rsquo;ll know how to navigate&nbsp;the platform and take advantage of its powerful features so you can start your own projects.</p>	https://www.skillshare.com/en/classes/Learn-Adobe-Illustrator-Fundamentals-for-Beginners/808971532?via=search-layout-grid	{}	/assets/previews/resource-vNpt7mU14tZybLpvXfDz4-preview.png	cm6qp60yj0047mliz1c6uv3en	2023-07-28 00:00:00	2025-02-05 10:56:28.729	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60yg0040mliz1l4jwf0j	Motion Beast	<p><a href="https://motiondesign.school/lessons/introduction-20/" target="_blank" rel="noopener noreferrer">https://motiondesign.school/lessons/introduction-20/</a></p>\n<p>username: studio@theonlinestudio.co.uk pass: Ch4rl0tt3</p>\n<p><a href="https://app.asana.com/app/asana/-/get_asset?asset_id=1205256688444682" target="_blank" rel="noopener noreferrer">https://app.asana.com/app/asana/-/get_asset?asset_id=1205256688444682</a></p>\n<p>Congratulations and welcome to the Motion Beast course.&nbsp;You&rsquo;ve made the right choice and there is a wonderful adventure in motion design waiting for you ahead. Let&rsquo;s see what you need to take with you on that journey, so that you can reach the final destination and become a real Motion Beast.</p>\n<p>So, if you&rsquo;ve opened this page hoping to discover an easy and quick way to achieve your goal &mdash; you&rsquo;re in the right place. This is so obvious that everyone around you already knows about it. If you want to achieve success in animation, 3D modeling, video production or anything else, the main thing you need to do is to practice as much as possible.</p>	https://motiondesign.school/lessons/introduction-20/	{}	/assets/previews/resource-ka1qNK0K3sTYHSURs1LXb-preview.png	cm6qp60y40036mliz49q23x9h	2023-08-11 00:00:00	2025-02-05 10:55:48.435	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60ys004tmlizxstnlmse	How to Create ''Microworlds''	{\n  "title": "How to Create ''Microworlds''",\n  "description": "<p>How I Create ''Microworlds''\\n<a href=\\"https://www.youtube.com/watch?v=Z6yXBh7WsKo\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://www.youtube.com/watch?v=Z6yXBh7WsKo</a></p><p><a href=\\"https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381456\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381456</a></p>",\n  "url": "https://www.youtube.com/watch?v=Z6yXBh7WsKo"\n}	https://www.youtube.com/watch?v=Z6yXBh7WsKo	{}	/assets/previews/resource-cm6qp60ys004tmlizxstnlmse-preview.png	cm6qp60yo004hmliz8ih5nj6o	2021-03-31 00:00:00	2025-02-04 18:33:04.152	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60z1005fmliz2t1sczu8	Master Shadows & Lighting in Compositing with Photoshop!	{\n  "title": "Master Shadows & Lighting in Compositing with Photoshop!",\n  "description": "<p><a href=\\"https://www.youtube.com/watch?v=Da4axkDKzxQ\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://www.youtube.com/watch?v=Da4axkDKzxQ</a></p><p><a href=\\"https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381458\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381458</a></p>",\n  "url": "https://www.youtube.com/watch?v=Da4axkDKzxQ"\n}	https://www.youtube.com/watch?v=Da4axkDKzxQ	{}	/assets/previews/resource-cm6qp60z1005fmliz2t1sczu8-preview.png	cm6qp60yo004hmliz8ih5nj6o	2021-07-07 00:00:00	2025-02-04 18:33:04.154	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60z8005xmlizcv9eh7at	Understanding Depth Of Field	{\n  "title": "Understanding Depth Of Field",\n  "description": "<p>Understanding Depth Of Field\\n<a href=\\"https://www.skillshare.com/classes/Understanding-Depth-Of-Field/787298081?via=search-layout-grid\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://www.skillshare.com/classes/Understanding-Depth-Of-Field/787298081?via=search-layout-grid</a></p>",\n  "url": "https://www.skillshare.com/classes/Understanding-Depth-Of-Field/787298081?via=search-layout-grid"\n}	https://www.skillshare.com/classes/Understanding-Depth-Of-Field/787298081?via=search-layout-grid	{}	/assets/previews/resource-cm6qp60z8005xmlizcv9eh7at-preview.png	cm6qp60yo004hmliz8ih5nj6o	2021-03-31 00:00:00	2025-02-04 18:33:04.156	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60yi0044mlizie3mkwvr	Fundamentals on UI Animation in After Effects	<p><a href="https://motiondesign.school/courses/fundamentals-on-ui-animation-in-after-effects/" target="_blank" rel="noopener noreferrer">https://motiondesign.school/courses/fundamentals-on-ui-animation-in-after-effects/</a></p>\n<p>username: studio@theonlinestudio.co.uk pass: Ch4rl0tt3</p>\n<p><a href="https://app.asana.com/app/asana/-/get_asset?asset_id=1205256688444688" target="_blank" rel="noopener noreferrer">https://app.asana.com/app/asana/-/get_asset?asset_id=1205256688444688</a></p>\n<p>Welcome! Hello and welcome to the course on interface animation in After Effects. Five fascinating lessons are waiting for you. Whatever skill level you have, you&rsquo;ll find something new and useful for yourself. Let&rsquo;s check it out 😉 For each lesson we&rsquo;ve prepared a set of tools and techniques. So, read every document attentively before you start working.</p>	https://motiondesign.school/courses/fundamentals-on-ui-animation-in-after-effects/	{}	/assets/previews/resource-ka1qNK0K3sTYHSURs1LXb-preview.png	cm6qp60y40036mliz49q23x9h	2023-08-11 00:00:00	2025-02-05 10:47:36.07	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60yd003smliz79b7sd5r	Water surface animation for a still image | 5 min	<p><a href="https://www.youtube.com/watch?v=_J-sOi1iacg" target="_blank" rel="noopener noreferrer">https://www.youtube.com/watch?v=_J-sOi1iacg</a></p>\n<p><a href="https://app.asana.com/app/asana/-/get_asset?asset_id=1206025424420103" target="_blank" rel="noopener noreferrer">https://app.asana.com/app/asana/-/get_asset?asset_id=1206025424420103</a></p>\n<h4>About This Class</h4>\n<p>You will learn how to make the water in still photos or paintings move like real water.</p>	https://www.youtube.com/watch?v=_J-sOi1iacg	{}	/assets/previews/resource-ka1qNK0K3sTYHSURs1LXb-preview.png	cm6qp60y40036mliz49q23x9h	2023-11-24 00:00:00	2025-02-05 10:55:55.739	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60yp004lmliz9of1dqv9	How to Use Sky Replacement Tool effectively	{\n  "title": "How to Use Sky Replacement Tool effectively",\n  "description": "<p><a href=\\"https://www.youtube.com/watch?v=ognLpUNLDwM\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://www.youtube.com/watch?v=ognLpUNLDwM</a></p><p><a href=\\"https://app.asana.com/app/asana/-/get_asset?asset_id=1205605135994556\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://app.asana.com/app/asana/-/get_asset?asset_id=1205605135994556</a></p>",\n  "url": "https://www.youtube.com/watch?v=ognLpUNLDwM"\n}	https://www.youtube.com/watch?v=ognLpUNLDwM	{}	/assets/previews/resource-cm6qp60yp004lmliz9of1dqv9-preview.png	cm6qp60yo004hmliz8ih5nj6o	2023-09-28 00:00:00	2025-02-04 18:33:04.158	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60yr004pmliz0k0dlnz5	3 Ways to Add Depth to Your Composite in Photoshop!	{\n  "title": "3 Ways to Add Depth to Your Composite in Photoshop!",\n  "description": "<p><a href=\\"https://www.youtube.com/watch?v=YqQ6yxclfWA\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://www.youtube.com/watch?v=YqQ6yxclfWA</a></p><p><a href=\\"https://app.asana.com/app/asana/-/get_asset?asset_id=1204358281433730\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://app.asana.com/app/asana/-/get_asset?asset_id=1204358281433730</a></p>",\n  "url": "https://www.youtube.com/watch?v=YqQ6yxclfWA"\n}	https://www.youtube.com/watch?v=YqQ6yxclfWA	{}	/assets/previews/resource-cm6qp60yr004pmliz0k0dlnz5-preview.png	cm6qp60yo004hmliz8ih5nj6o	2023-04-09 00:00:00	2025-02-04 18:33:04.159	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60zn0071mlizctuy3kmc	Skillshare: Creating Expert Level Shadows	{\n  "title": "Skillshare: Creating Expert Level Shadows",\n  "description": "<p>When you've finished the course - Tick off you name below</p><p><a href=\\"https://www.skillshare.com/classes/Photoshop-Like-a-Professional-Creating-Expert-Level-Shadows/1563565830\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://www.skillshare.com/classes/Photoshop-Like-a-Professional-Creating-Expert-Level-Shadows/1563565830</a></p>",\n  "url": "https://www.skillshare.com/classes/Photoshop-Like-a-Professional-Creating-Expert-Level-Shadows/1563565830"\n}	https://www.skillshare.com/classes/Photoshop-Like-a-Professional-Creating-Expert-Level-Shadows/1563565830	{}	/assets/previews/resource-cm6qp60zn0071mlizctuy3kmc-preview.png	cm6qp60yo004hmliz8ih5nj6o	2021-02-25 00:00:00	2025-02-04 18:33:04.165	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp610c007pmlizm90sie2k	Realistic Shallow Depth of Field Effect Using Depth Maps	{\n  "title": "Realistic Shallow Depth of Field Effect Using Depth Maps",\n  "description": "<p>Photoshop Tutorial: Realistic Shallow Depth of Field Effect Using Depth Maps\\n<a href=\\"https://www.youtube.com/watch?v=sKKhuOXwAAk\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://www.youtube.com/watch?v=sKKhuOXwAAk</a></p><p><a href=\\"https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381462\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381462</a></p>",\n  "url": "https://www.youtube.com/watch?v=sKKhuOXwAAk"\n}	https://www.youtube.com/watch?v=sKKhuOXwAAk	{}	/assets/previews/resource-cm6qp610c007pmlizm90sie2k-preview.png	cm6qp60yo004hmliz8ih5nj6o	2021-03-31 00:00:00	2025-02-04 18:33:04.167	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60xv002tmlizfp1fcd1h	Beginner to Pro Class | Unit 4: Variables and Styles	<p>Class: <a href="https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons" target="_blank" rel="noopener noreferrer">https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons</a> This lesson starts at 32. VARIABLES - 01 Introduction to variables</p>\n<p>username: studio@theonlinestudio.co.uk pass: ch4rl0tt3</p>\n<h4>About This Class</h4>\n<p>A beginner's course in UX/UI design with Figma This course is a comprehensive introduction to Figma from absolute Figma beginner to advanced features. Short and focused, providing you with all you need to know to tackle any design.</p>\n<p>We'll start from scratch by setting up your Figma account and familiarising ourselves with its file structure. Then, we'll dive into the fundamentals of Figma, such as setting up frames and nesting them, adding shapes, text, colours, and grids, and creating solid UI designs. Once you're comfortable with the basics, we dive into more advanced subjects like creating solid UI designs and working with components for reusable elements.</p>\n<p>You'll learn how to establish styles and variables for consistency, create responsive designs with auto layout, and add basic prototyping to bring your designs to life&mdash;always keeping collaboration with development in mind.</p>\n<p>With step-by-step exercises and valuable tips and tricks, you'll become proficient in Figma in under 4 hours. It's perfect for beginners or those switching from other design software like Sketch or Adobe XD to Figma.</p>\n<h4>Variables and Styles</h4>\n<p>Introduction to variables Working with colour variables Organising with variable collections and groups Size and spacing variables And what about styles? Typography and styles Documenting variables and styles</p>	https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons	{}	/assets/previews/resource-vN01lXRESV9IMfiEZBK6x-preview.png	cm6qp60xn002bmliznf4d8g9l	2023-10-25 00:00:00	2025-02-05 10:54:52.02	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp611l009jmlizi653knsb	How to stylish highlights in Photoshop CC	{\n  "title": "How to stylish highlights in Photoshop CC",\n  "description": "<p><a href=\\"https://www.youtube.com/watch?v=Y-RXsQLvFNQ\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://www.youtube.com/watch?v=Y-RXsQLvFNQ</a></p><p><a href=\\"https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381468\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381468</a></p>",\n  "url": "https://www.youtube.com/watch?v=Y-RXsQLvFNQ"\n}	https://www.youtube.com/watch?v=Y-RXsQLvFNQ	{}	/assets/previews/resource-cm6qp611l009jmlizi653knsb-preview.png	cm6qp60yo004hmliz8ih5nj6o	2021-04-15 00:00:00	2025-02-04 18:33:04.168	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp6119008zmlizxl4zkl5s	How to Place Anything in Perspective in Photoshop	{\n  "title": "How to Place Anything in Perspective in Photoshop",\n  "description": "<p><a href=\\"https://www.youtube.com/watch?v=7MM2_oVDi_o\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://www.youtube.com/watch?v=7MM2_oVDi_o</a></p><p><a href=\\"https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381466\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381466</a></p>",\n  "url": "https://www.youtube.com/watch?v=7MM2_oVDi_o"\n}	https://www.youtube.com/watch?v=7MM2_oVDi_o	{}	/assets/previews/resource-cm6qp6119008zmlizxl4zkl5s-preview.png	cm6qp60yo004hmliz8ih5nj6o	2021-06-09 00:00:00	2025-02-04 18:33:04.172	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60yp004jmlizggkydz9h	How to make Transparent Glass in Photoshop	{\n  "title": "How to make Transparent Glass in Photoshop",\n  "description": "<p><a href=\\"https://www.youtube.com/watch?v=sSDQM_6igQo\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://www.youtube.com/watch?v=sSDQM_6igQo</a></p><p><a href=\\"https://app.asana.com/app/asana/-/get_asset?asset_id=1208527941261208\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://app.asana.com/app/asana/-/get_asset?asset_id=1208527941261208</a></p>",\n  "url": "https://www.youtube.com/watch?v=sSDQM_6igQo"\n}	https://www.youtube.com/watch?v=sSDQM_6igQo	{}	/assets/previews/resource-cm6qp60yp004jmlizggkydz9h-preview.png	cm6qp60yo004hmliz8ih5nj6o	2024-10-11 00:00:00	2025-02-04 18:33:04.157	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60ye003wmlizyndsdb6o	11 Expressions for Animation Efficiency in Adobe After Effects | 1:10 h	<p><a href="https://www.skillshare.com/en/classes/11-Expressions-for-Animation-Efficiency-in-Adobe-After-Effects/451087798?via=search-layout-grid" target="_blank" rel="noopener noreferrer">https://www.skillshare.com/en/classes/11-Expressions-for-Animation-Efficiency-in-Adobe-After-Effects/451087798?via=search-layout-grid</a></p>\n<p>username: studio@theonlinestudio.co.uk pass: ch4rl0tt3</p>\n<h4>About This Class</h4>\n<p>Unlock a powerful side of Adobe After Effects where code controls animation. Learn 11 different expressions to automate animations, eliminate excessive keyframes, achieve complex effects, and work more efficiently; no programming experience needed!</p>\n<p>An expression is a short block of code, written in JavaScript that modifies an animatable property. Expressions can be useful in many different cases in motion design: Create continuous, repetitive, or reactive motion Automate animations Avoid excessive keyframes Set up rigs</p>\n<p>This class covers 11 different expressions so you can understand what they do and how to use them, without actually needing to learn how to write JavaScript. Plus, I&rsquo;ll provide examples of how I use expressions in real projects.&nbsp;You&rsquo;ll be able to start using these expressions in your animations to work more efficiently and achieve effects that would have been extremely tedious or impossible before.</p>\n<p>In future classes, once you&rsquo;ve gotten comfortable using these expressions in your work, you can move on to learning how to write your own expressions. This class is a perfect intro into the advanced topic of expressions which can open up a whole new, customisable side of Adobe After Effects.</p>\n<h4>Who this class is for:</h4>\n<p>This class is for motion designers who are comfortable with the basics of Adobe After Effects and want to take their workflow to the next level. No programming experience is needed!</p>\n<h4>What you should know before taking this class:</h4>\n<p>Adobe After Effects basics like creating compositions, setting keyframes, rendering, etc. How to connect (parent) layers and properties How to apply an effect to a layer How to animate the path of a shape How to add easing to keyframes and use the graph editor to adjust the spacing of an animation</p>	https://www.skillshare.com/en/classes/11-Expressions-for-Animation-Efficiency-in-Adobe-After-Effects/451087798?via=search-layout-grid	{}	/assets/previews/resource-ka1qNK0K3sTYHSURs1LXb-preview.png	cm6qp60y40036mliz49q23x9h	2023-11-24 00:00:00	2025-02-05 10:56:02.829	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp612n00brmliz5a4rfdwf	Video: How to create stylish highlights	{\n  "title": "Video: How to create stylish highlights",\n  "description": "<p>How to create stylish highlights in Photoshop CC 2020!\\n<a href=\\"https://www.youtube.com/watch?v=yUPIChL7_x8\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://www.youtube.com/watch?v=yUPIChL7_x8</a></p><p><a href=\\"https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381476\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381476</a></p>",\n  "url": "https://www.youtube.com/watch?v=yUPIChL7_x8"\n}	https://www.youtube.com/watch?v=yUPIChL7_x8	{}	/assets/previews/resource-cm6qp612n00brmliz5a4rfdwf-preview.png	cm6qp60yo004hmliz8ih5nj6o	2021-03-03 00:00:00	2025-02-04 18:33:04.177	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp612f00bbmlizfq5fiap5	How To Draw Perspective Shadow - Drawing Shadows In Perspective	{\n  "title": "How To Draw Perspective Shadow - Drawing Shadows In Perspective",\n  "description": "<p><a href=\\"https://www.youtube.com/watch?v=8XLgmiExAbw\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://www.youtube.com/watch?v=8XLgmiExAbw</a></p><p><a href=\\"https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381474\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381474</a></p>",\n  "url": "https://www.youtube.com/watch?v=8XLgmiExAbw"\n}	https://www.youtube.com/watch?v=8XLgmiExAbw	{}	/assets/previews/resource-cm6qp612f00bbmlizfq5fiap5-preview.png	cm6qp60yo004hmliz8ih5nj6o	2021-06-16 00:00:00	2025-02-04 18:33:04.18	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60yb003omlizryarh70e	Twinkling Stars  | 2 min	<p><a href="https://www.youtube.com/watch?v=S_kx93-ucWE&amp;t=45s" target="_blank" rel="noopener noreferrer">https://www.youtube.com/watch?v=S_kx93-ucWE&amp;t=45s</a></p>\n<p><a href="https://app.asana.com/app/asana/-/get_asset?asset_id=1206025424420095" target="_blank" rel="noopener noreferrer">https://app.asana.com/app/asana/-/get_asset?asset_id=1206025424420095</a></p>\n<h4>About This Class</h4>\n<p>You will learn how to use CC Particle World to create a Twinkling Stars sky</p>	https://www.youtube.com/watch?v=S_kx93-ucWE&t=45s	{}	/assets/previews/resource-ka1qNK0K3sTYHSURs1LXb-preview.png	cm6qp60y40036mliz49q23x9h	2023-11-24 00:00:00	2025-02-05 10:56:13.73	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp610x008dmliz0pllv4tl	Cutout Hair on a black background	{\n  "title": "Cutout Hair on a black background",\n  "description": "<p><a href=\\"https://youtu.be/G030sJcK9oA\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://youtu.be/G030sJcK9oA</a></p><p><a href=\\"https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381464\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381464</a></p>",\n  "url": "https://youtu.be/G030sJcK9oA"\n}	https://youtu.be/G030sJcK9oA	{}	/assets/previews/resource-cm6qp610x008dmliz0pllv4tl-preview.png	cm6qp60yo004hmliz8ih5nj6o	2021-04-09 00:00:00	2025-02-04 18:33:04.21	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60wj0005mlizowjry6xw	Blender Fast Track Part 1: Minecraft	<p><a href="https://app.asana.com/app/asana/-/get_asset?asset_id=1205395078316468" target="_blank" rel="noopener noreferrer">https://app.asana.com/app/asana/-/get_asset?asset_id=1205395078316468</a></p>\n<p><a href="https://www.cgfasttrack.com/tutorials/blender-fast-track-vol-1-minecraft-4" target="_blank" rel="noopener noreferrer">https://www.cgfasttrack.com/tutorials/blender-fast-track-vol-1-minecraft-4</a></p>\n<p>Username: corin@theonline.studio Pass: charlotte</p>\n<h4>Blender Fast Track Vol 1: Minecraft (Remastered)</h4>\n<p>Start here with this easy-to-follow introduction, where you&rsquo;ll build a small Minecraft-style scene. Take a broad look at the user interface as you begin to learn the fundamentals of 3D animation and end with a fun destruction simulation!</p>	https://www.cgfasttrack.com/tutorials/blender-fast-track-vol-1-minecraft-4	{}	/assets/previews/resource-h2pfo5kw_URWxy1EpxMFz-preview.png	cm6qp60wi0003mliz5pet2n8a	2023-08-31 00:00:00	2025-02-05 10:44:18.35	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60xz0035mlizpk6iyggk	Components 0 to 1 Practice & Cheat Sheet	<p>Become a master at creating and using Figma Components, Instances and Variants with these simple exercises.</p>\n<p><a href="https://www.figma.com/file/VTXwD8IniSXgBEjYuFjrvi/Component-Practice-%26-Cheat-Sheet-(Community)?type=design&amp;node-id=1-2&amp;mode=design&amp;t=y00RG2GPpYfas7sO-0" target="_blank" rel="noopener noreferrer">https://www.figma.com/file/VTXwD8IniSXgBEjYuFjrvi/Component-Practice-%26-Cheat-Sheet-(Community)?type=design&amp;node-id=1-2&amp;mode=design&amp;t=y00RG2GPpYfas7sO-0</a></p>\n<p><a href="https://app.asana.com/app/asana/-/get_asset?asset_id=1205101408176181" target="_blank" rel="noopener noreferrer">https://app.asana.com/app/asana/-/get_asset?asset_id=1205101408176181</a></p>	https://www.figma.com/file/VTXwD8IniSXgBEjYuFjrvi/Component-Practice-%26-Cheat-Sheet-(Community)?type=design&node-id=1-2&mode=design&t=y00RG2GPpYfas7sO-0	{}	/assets/previews/resource-BHD0kCqs7i-cJSdbXBF5_-preview.png	cm6qp60xn002bmliznf4d8g9l	2023-07-14 00:00:00	2025-02-05 11:14:46.446	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60y7003emlizwbv3o2c8	Text Animators: Custom Text Animation in Adobe After Effects	<p><a href="https://www.skillshare.com/en/classes/Text-Animators-Custom-Text-Animation-in-Adobe-After-Effects/1739980266?via=search-layout-grid" target="_blank" rel="noopener noreferrer">https://www.skillshare.com/en/classes/Text-Animators-Custom-Text-Animation-in-Adobe-After-Effects/1739980266?via=search-layout-grid</a></p>\n<p>username: studio@theonlinestudio.co.uk pass: ch4rl0tt3</p>\n<p><a href="https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381482" target="_blank" rel="noopener noreferrer">https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381482</a></p>\n<p>About This Class Learn how to create custom text animations with text animators: After Effects&rsquo; built-in system specifically designed to animate text.</p>\n<p>If you create motion graphics or videos of any kind, being able to animate text is a necessity. Using text animators, you have numerous options for animating each letter, word, or line of text. It&rsquo;s quick to set up and easy to edit what the text says even after you&rsquo;ve created the animation. Plus, you can save the animation as a preset so you can easily reuse it on any text layer, in any After Effects project; no need to recreate or even import anything. You can even share text animation presets with others.</p>\n<p>What you&rsquo;ll learn: How text animators work What different text animator options and controllers do What Selector Shapes do and how to animate with the Range Selector What properties can be animated How to adjust easing on text animators How to use multiple text animators for more complex animations When to use the Wiggly Selector How to make text 3D (using After Effects) How to save your custom text animators as a preset Plus, I&rsquo;ll show you 8 different examples that demonstrate a wide range of possibilities. Using what you learn, you&rsquo;ll be able to create your own unique text animations.</p>\n<p>Included with this class: An After Effects project file with guides to help you visualize what different text animator options and controllers do 6 text animator presets Who this class is for: Text animators work a little differently than other types of animation in After Effects. This means that if you already have experience with After Effects animation, but haven&rsquo;t touched text animators, you&rsquo;ll get a lot out of this class. It also means that you don&rsquo;t need to know a ton about After Effects to be successful. Before taking this class you should know some After Effects basics like how to create a composition and set keyframes.</p>	https://www.skillshare.com/en/classes/Text-Animators-Custom-Text-Animation-in-Adobe-After-Effects/1739980266?via=search-layout-grid	{}	/assets/previews/resource-ka1qNK0K3sTYHSURs1LXb-preview.png	cm6qp60y40036mliz49q23x9h	2023-07-28 00:00:00	2025-02-05 10:56:20.466	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60yl004emlizqj36r1zr	Adobe InDesign CC - Essentials Training	<p><a href="https://www.skillshare.com/en/classes/Adobe-InDesign-CC-Essentials-Training-Course/1170360090/projects?via=search-layout-grid" target="_blank" rel="noopener noreferrer">https://www.skillshare.com/en/classes/Adobe-InDesign-CC-Essentials-Training-Course/1170360090/projects?via=search-layout-grid</a></p>\n<p>username: studio@theonlinestudio.co.uk pass: Ch4rl0tt3</p>\n<p><a href="https://app.asana.com/app/asana/-/get_asset?asset_id=1205257081011217" target="_blank" rel="noopener noreferrer">https://app.asana.com/app/asana/-/get_asset?asset_id=1205257081011217</a></p>\n<p>Overview Hi there, my name is&nbsp; Dan. I am a graphic designer and Adobe Certified Instructor (ACI) for InDesign.&nbsp;We will work with colour, picking your own and also using corporate colours. You will explore how to choose &amp; use fonts like a professional. We will find, resize &amp; crop images for your documents. There are projects for you to complete, so you can practise your skills &amp; use these for your creative portfolio. In this course I supply exercise files so you can play along. I will also save my files as I go through each video so that you can compare yours to mine - handy if something goes wrong. Know that I will be around to help - if you get lost you can drop a post on the video 'Questions and Answers' below each video and I'll be sure to get back to you. I will share every design trick I have learnt in the last 15 years of designing. My goal is for you to finish this course with all the necessary skills to start making beautiful documents using InDesign.</p>\n<p>NOTE: Adobe InDesign CC 2018 or above recommended.&nbsp;&nbsp; Exercise files: <a href="https://www.dropbox.com/s/ec9i80lq45bi3ny/Exercise%20Files%20-%20InDesign%20Essentials.zip?dl=0" target="_blank" rel="noopener noreferrer">https://www.dropbox.com/s/ec9i80lq45bi3ny/Exercise%20Files%20-%20InDesign%20Essentials.zip?dl=0</a> Completed&nbsp;files:&nbsp;<a href="https://www.dropbox.com/sh/plsvikpfrxt5the/AADBe0OeFxiwaDSEgDm0Q4via?dl=0" target="_blank" rel="noopener noreferrer">https://www.dropbox.com/sh/plsvikpfrxt5the/AADBe0OeFxiwaDSEgDm0Q4via?dl=0</a></p>	https://www.skillshare.com/en/classes/Adobe-InDesign-CC-Essentials-Training-Course/1170360090/projects?via=search-layout-grid	{}	/assets/previews/resource-_864GpGgrtNdSoU0Bq50C-preview.png	cm6qp60yl004cmlizbulcya5p	2023-08-09 00:00:00	2025-02-05 10:57:17.362	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60xt002pmliz15p5th6p	Beginner to Pro Class | Unit 3: Introducing Components	<p>Class: <a href="https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons" target="_blank" rel="noopener noreferrer">https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons</a> This lesson starts at 23. COMPONENTS - 01 Re-use elements with components and instances</p>\n<p>username: studio@theonlinestudio.co.uk pass: ch4rl0tt3</p>\n<h4>About This Class</h4>\n<p>A beginner's course in UX/UI design with Figma This course is a comprehensive introduction to Figma from absolute Figma beginner to advanced features. Short and focused, providing you with all you need to know to tackle any design.</p>\n<p>We'll start from scratch by setting up your Figma account and familiarising ourselves with its file structure. Then, we'll dive into the fundamentals of Figma, such as setting up frames and nesting them, adding shapes, text, colours, and grids, and creating solid UI designs. Once you're comfortable with the basics, we dive into more advanced subjects like creating solid UI designs and working with components for reusable elements.</p>\n<p>You'll learn how to establish styles and variables for consistency, create responsive designs with auto layout, and add basic prototyping to bring your designs to life&mdash;always keeping collaboration with development in mind.</p>\n<p>With step-by-step exercises and valuable tips and tricks, you'll become proficient in Figma in under 4 hours. It's perfect for beginners or those switching from other design software like Sketch or Adobe XD to Figma.</p>\n<h4>Introducing Components</h4>\n<p>Re-use elements with components and instances Overriding instances What to override and what not to Reverting components and overrides Nest components Component sets with variants Move components to their own page Keeping components organised Advanced component features introduction</p>	https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons	{}	/assets/previews/resource-BHD0kCqs7i-cJSdbXBF5_-preview.png	cm6qp60xn002bmliznf4d8g9l	2023-10-25 00:00:00	2025-02-05 11:15:00.71	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60xs002lmlizoksufrem	Beginner to Pro Class | Unit 2: Figma Basics	<p>Class: <a href="https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons" target="_blank" rel="noopener noreferrer">https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons</a> This lesson starts at 7. BASICS - 01 Adding frames to our file</p>\n<p>username: studio@theonlinestudio.co.uk pass: ch4rl0tt3</p>\n<h4>About This Class</h4>\n<p>A beginner's course in UX/UI design with Figma This course is a comprehensive introduction to Figma from absolute Figma beginner to advanced features. Short and focused, providing you with all you need to know to tackle any design.</p>\n<p>We'll start from scratch by setting up your Figma account and familiarising ourselves with its file structure. Then, we'll dive into the fundamentals of Figma, such as setting up frames and nesting them, adding shapes, text, colours, and grids, and creating solid UI designs. Once you're comfortable with the basics, we dive into more advanced subjects like creating solid UI designs and working with components for reusable elements.</p>\n<p>You'll learn how to establish styles and variables for consistency, create responsive designs with auto layout, and add basic prototyping to bring your designs to life&mdash;always keeping collaboration with development in mind.</p>\n<p>With step-by-step exercises and valuable tips and tricks, you'll become proficient in Figma in under 4 hours. It's perfect for beginners or those switching from other design software like Sketch or Adobe XD to Figma.</p>\n<h4>Figma Basics</h4>\n<p>Adding frames to our file A few handy shortcuts Design file overview Adding shapes and colour Size menu &ndash; manipulating shapes and frames Align, tidy up, and measure Adding and working with text Nesting frames &ndash; The Figma superpower Frames vs Groups Designing with nested frames Re-usable grids with styles Figma Community and Plugins Adding images Drawing in Figma Scaling in Figma</p>	https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons	{}	/assets/previews/resource-BHD0kCqs7i-cJSdbXBF5_-preview.png	cm6qp60xn002bmliznf4d8g9l	2023-10-25 00:00:00	2025-02-05 11:15:09.707	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60xq002hmlizrexhdpo3	Figma: Beginner to Pro Class | Unit 1: Getting Started	<p>Class: <a href="https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons" target="_blank" rel="noopener noreferrer">https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons</a> This lesson starts at 1. Intro</p>\n<p><a href="https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons" target="_blank" rel="noopener noreferrer">https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons</a></p>\n<p>username: studio@theonlinestudio.co.uk pass: ch4rl0tt3</p>\n<h4>About This Class</h4>\n<p>A beginner's course in UX/UI design with Figma This course is a comprehensive introduction to Figma from absolute Figma beginner to advanced features. Short and focused, providing you with all you need to know to tackle any design.</p>\n<p>We'll start from scratch by setting up your Figma account and familiarising ourselves with its file structure. Then, we'll dive into the fundamentals of Figma, such as setting up frames and nesting them, adding shapes, text, colours, and grids, and creating solid UI designs. Once you're comfortable with the basics, we dive into more advanced subjects like creating solid UI designs and working with components for reusable elements.</p>\n<p>You'll learn how to establish styles and variables for consistency, create responsive designs with auto layout, and add basic prototyping to bring your designs to life&mdash;always keeping collaboration with development in mind.</p>\n<p>With step-by-step exercises and valuable tips and tricks, you'll become proficient in Figma in under 4 hours. It's perfect for beginners or those switching from other design software like Sketch or Adobe XD to Figma.</p>\n<h4>Getting Started</h4>\n<p>1. Getting Figma - Registration Process 2. Figma in the Browser vs. Figma App 3. The Figma file browser &ndash; Figma's home 4. Creating design files in Figma</p>	https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons	{}	/assets/previews/resource-BHD0kCqs7i-cJSdbXBF5_-preview.png	cm6qp60xn002bmliznf4d8g9l	2023-10-25 00:00:00	2025-02-05 11:14:26.787	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60xo002dmliz7gr4oqpo	Create a Basic Asset	<p>Follow Felipes First session to create a basic OLS social asset.</p>\n<p>You can watch the video <a href="https://drive.google.com/drive/folders/1u-C0zOJYEb7oQvwKlYKHQsJ3a-JqILn-" target="_blank" rel="noopener noreferrer">https://drive.google.com/drive/folders/1u-C0zOJYEb7oQvwKlYKHQsJ3a-JqILn-</a></p>\n<p>You can look at the workbook <a href="https://docs.google.com/presentation/d/1hmx0TaaD4uxJp-nj_vxBW1eUC6ZEMZxXiRGcdiYCH5U/edit?usp=sharing" target="_blank" rel="noopener noreferrer">https://docs.google.com/presentation/d/1hmx0TaaD4uxJp-nj_vxBW1eUC6ZEMZxXiRGcdiYCH5U/edit?usp=sharing</a></p>\n<p>You can find the assets to duplicate <a href="https://www.figma.com/file/h2NcHyaFQGOZKmI59g3ShG/Session-One%3A-Create-a-Basic-Asset?type=design&amp;node-id=0%3A1&amp;t=IFHay2mSytRu9BV3-1" target="_blank" rel="noopener noreferrer">https://www.figma.com/file/h2NcHyaFQGOZKmI59g3ShG/Session-One%3A-Create-a-Basic-Asset?type=design&amp;node-id=0%3A1&amp;t=IFHay2mSytRu9BV3-1</a></p>\n<p>Please go to <a href="https://docs.google.com/presentation/d/1hmx0TaaD4uxJp-nj_vxBW1eUC6ZEMZxXiRGcdiYCH5U/edit#slide=id.g2403a29dede_0_275" target="_blank" rel="noopener noreferrer">https://docs.google.com/presentation/d/1hmx0TaaD4uxJp-nj_vxBW1eUC6ZEMZxXiRGcdiYCH5U/edit#slide=id.g2403a29dede_0_275</a> of the workbook and follow the instructions on how this board works and how to get your own basic Figma template to practice with.</p>	https://drive.google.com/drive/folders/1u-C0zOJYEb7oQvwKlYKHQsJ3a-JqILn-	{}	/assets/previews/resource-BHD0kCqs7i-cJSdbXBF5_-preview.png	cm6qp60xn002bmliznf4d8g9l	2023-04-28 00:00:00	2025-02-05 11:14:39.322	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp611u00a3mliziattvt9k	Create Flawless & Seamless Backdrops with Photoshop	{\n  "title": "Create Flawless & Seamless Backdrops with Photoshop",\n  "description": "<p>Create Flawless & Seamless Backdrops with Photoshop\\n<a href=\\"https://www.youtube.com/watch?v=336M9VM5eiI&t=292s\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://www.youtube.com/watch?v=336M9VM5eiI&t=292s</a></p><p><a href=\\"https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381470\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381470</a></p>",\n  "url": "https://www.youtube.com/watch?v=336M9VM5eiI&t=292s"\n}	https://www.youtube.com/watch?v=336M9VM5eiI&t=292s	{}	/assets/previews/resource-cm6qp611u00a3mliziattvt9k-preview.png	cm6qp60yo004hmliz8ih5nj6o	2021-03-04 00:00:00	2025-02-04 18:33:04.213	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60zg006jmliz8wtalnho	Changing Colours using HSB Values	{\n  "title": "Changing Colours using HSB Values",\n  "description": "<p><a href=\\"https://www.youtube.com/watch?v=Anto0kf2kuA&t=442s\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://www.youtube.com/watch?v=Anto0kf2kuA&t=442s</a></p><p><a href=\\"https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381460\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381460</a></p>",\n  "url": "https://www.youtube.com/watch?v=Anto0kf2kuA&t=442s"\n}	https://www.youtube.com/watch?v=Anto0kf2kuA&t=442s	{}	/assets/previews/resource-cm6qp60zg006jmliz8wtalnho-preview.png	cm6qp60yo004hmliz8ih5nj6o	2021-06-28 00:00:00	2025-02-04 18:33:04.198	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp612700apmlizc92tw4tj	Remove Halos from Cutout images	{\n  "title": "Remove Halos from Cutout images",\n  "description": "<p><a href=\\"https://www.youtube.com/watch?v=LNAUh3MfVBs\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://www.youtube.com/watch?v=LNAUh3MfVBs</a></p><p><a href=\\"https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381472\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381472</a></p>",\n  "url": "https://www.youtube.com/watch?v=LNAUh3MfVBs"\n}	https://www.youtube.com/watch?v=LNAUh3MfVBs	{}	/assets/previews/resource-cm6qp612700apmlizc92tw4tj-preview.png	cm6qp60yo004hmliz8ih5nj6o	2021-05-15 00:00:00	2025-02-04 18:33:04.215	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp612x00cdmliz385swafs	Video: How to Cut Out Backgrounds and KEEP The Original Shadows	{\n  "title": "Video: How to Cut Out Backgrounds and KEEP The Original Shadows",\n  "description": "<p>Photoshop: How to Cut Out Backgrounds and KEEP The Original Shadows\\n<a href=\\"https://www.youtube.com/watch?v=Q4YVE1NPEfg\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://www.youtube.com/watch?v=Q4YVE1NPEfg</a></p><p><a href=\\"https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381478\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://app.asana.com/app/asana/-/get_asset?asset_id=1205159579381478</a></p>",\n  "url": "https://www.youtube.com/watch?v=Q4YVE1NPEfg"\n}	https://www.youtube.com/watch?v=Q4YVE1NPEfg	{}	/assets/previews/resource-cm6qp612x00cdmliz385swafs-preview.png	cm6qp60yo004hmliz8ih5nj6o	2021-03-03 00:00:00	2025-02-04 18:33:04.22	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60xx0031mlizvro8pj0g	Beginner to Pro Class | Unit 6: Basic Prototyping	<p>Class: <a href="https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons" target="_blank" rel="noopener noreferrer">https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons</a> This lesson starts at 50. PROTOTYPING - 01 The Figma prototype workspace username: studio@theonlinestudio.co.uk pass: ch4rl0tt3</p>\n<h4>About This Class</h4>\n<p>A beginner's course in UX/UI design with Figma This course is a comprehensive introduction to Figma from absolute Figma beginner to advanced features. Short and focused, providing you with all you need to know to tackle any design.</p>\n<p>We'll start from scratch by setting up your Figma account and familiarising ourselves with its file structure. Then, we'll dive into the fundamentals of Figma, such as setting up frames and nesting them, adding shapes, text, colours, and grids, and creating solid UI designs. Once you're comfortable with the basics, we dive into more advanced subjects like creating solid UI designs and working with components for reusable elements.</p>\n<p>You'll learn how to establish styles and variables for consistency, create responsive designs with auto layout, and add basic prototyping to bring your designs to life&mdash;always keeping collaboration with development in mind.</p>\n<p>With step-by-step exercises and valuable tips and tricks, you'll become proficient in Figma in under 4 hours. It's perfect for beginners or those switching from other design software like Sketch or Adobe XD to Figma.</p>\n<h4>Basic Prototyping</h4>\n<p>Prototyping in Figma Setting scroll behaviour Connecting screens Dropdown menu with overlays Animation types Interactive components Figma Mirror &ndash; Preview on your device</p>	https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons	{}	/assets/previews/resource-BHD0kCqs7i-cJSdbXBF5_-preview.png	cm6qp60xn002bmliznf4d8g9l	2023-10-25 00:00:00	2025-02-05 11:14:51.597	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60y50038mlizzbxk24w2	Learn After Effects in 2 h	<p><a href="https://www.skillshare.com/en/classes/Learn-After-Effects-In-Only-Two-Hours/1982651597/projects?via=user-profile" target="_blank" rel="noopener noreferrer">https://www.skillshare.com/en/classes/Learn-After-Effects-In-Only-Two-Hours/1982651597/projects?via=user-profile</a></p>\n<p>username: studio@theonlinestudio.co.uk pass: ch4rl0tt3</p>\n<p><a href="https://app.asana.com/app/asana/-/get_asset?asset_id=1205395179975861" target="_blank" rel="noopener noreferrer">https://app.asana.com/app/asana/-/get_asset?asset_id=1205395179975861</a></p>\n<h4>About This Class</h4>\n<p>Learn Adobe After Effects In only TWO Hours! Have you ever thought of becoming a Motion Graphics Designer or Visual Effects Artist? Ever wanted to create your own Animations or Cartoons or wanted to know&nbsp;how to create your own amazing Visual Effects / Special Effects (VFX)? Well now you can!&nbsp;-&nbsp;In just 2 Hours! Adobe After Effects is seen as the industry standard when it comes to Motion Graphics,&nbsp;Visual Effects (VFX) and Animation. During the following&nbsp;two&nbsp;hours you will learn all the basics and even some advanced techniques using this amazing application! Learn&nbsp;these 22 lessons and you will be able to create anything that you can imagine!</p>\n<p>What will you learn? The Interface FX Console Keeping Things Neat And Tidy Importing Assets In To After Effects Creating Your First Composition Working With 2D Layers Working With 3D Layers Adding Effects To Layers Creating Text In After Effects Animation Basics And Keyframes The Pivot Point Layer Parenting Working With Solids Null Objects Pre Composing Layers Rotoscoping And Masks Adjustment Layers Green Screen and Chroma Keying 2D Motion Tracking 3D Camera Tracking Adding Motion Blur Rendering From After Effects</p>\n<p>All this is just 2 HOURS! Good luck and have lots of fun! Please upload your class project deliverable as mp4 to the Skillshare project gallery for review! You can find the details regarding the project under Class Project.</p>	https://www.skillshare.com/en/classes/Learn-After-Effects-In-Only-Two-Hours/1982651597/projects?via=user-profile	{}	/assets/previews/resource-ka1qNK0K3sTYHSURs1LXb-preview.png	cm6qp60y40036mliz49q23x9h	2023-08-31 00:00:00	2025-02-05 10:56:08.223	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60yo004gmliz71qci7sy	Learn Adobe InDesign: By Creating a Recipe Card	<p><a href="https://www.skillshare.com/en/classes/Learn-Adobe-InDesign-By-Creating-a-Recipe-Card/920003117?via=search-layout-grid" target="_blank" rel="noopener noreferrer">https://www.skillshare.com/en/classes/Learn-Adobe-InDesign-By-Creating-a-Recipe-Card/920003117?via=search-layout-grid</a></p>\n<p>username: studio@theonlinestudio.co.uk pass: Ch4rl0tt3</p>\n<p><a href="https://app.asana.com/app/asana/-/get_asset?asset_id=1205257081011221" target="_blank" rel="noopener noreferrer">https://app.asana.com/app/asana/-/get_asset?asset_id=1205257081011221</a></p>\n<h4>About This Class</h4>\n<p>Learn Adobe InDesign CC for Beginners: Create a Cookbook layout with Grids, Paragraph Styles, Resizing Images, Shortcuts, Content Aware Fit &amp; export it to a PDF.&nbsp; We&nbsp;will learn a whole bunch of InDesign skills by creating a 2 page spread&nbsp;Recipe Card. It is especially a great introduction to InDesign's&nbsp;Paragraph &amp; Character Styles- One of the most useful tools for&nbsp;Text and Typography. What we will cover: - Setting up a Document - Guides - Shortcuts - Tools - Shapes - Colors for Print/Web - CMYK / RGB - Images - Fit to Frame - Gridify - Duplicating - Typography - Paragraph &amp; Character Styles - Saving &amp; Exporting</p>\n<p>Are you ready&nbsp;to create your own&nbsp;Recipe Layout? Note: To download the course files please go to the 'Projects &amp; Resources' Tab</p>	https://www.skillshare.com/en/classes/Learn-Adobe-InDesign-By-Creating-a-Recipe-Card/920003117?via=search-layout-grid	{}	/assets/previews/resource-ZeumcqeXvSsHyvI-cbDIJ-preview.png	cm6qp60yl004cmlizbulcya5p	2023-08-11 00:00:00	2025-02-05 10:57:25.916	Training	cm6qpbpto0000s7tr09q0tf8t
cm6qp60xw002xmlizrzd61cln	Beginner to Pro Class | Unit 5: Responsive Design	<p>Class: <a href="https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons" target="_blank" rel="noopener noreferrer">https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons</a> This lesson starts at 39. RESPONSIVE - 01 What is auto layout?</p>\n<p>username: studio@theonlinestudio.co.uk pass: ch4rl0tt3</p>\n<h4>About This Class</h4>\n<p>A beginner's course in UX/UI design with Figma This course is a comprehensive introduction to Figma from absolute Figma beginner to advanced features. Short and focused, providing you with all you need to know to tackle any design.</p>\n<p>We'll start from scratch by setting up your Figma account and familiarising ourselves with its file structure. Then, we'll dive into the fundamentals of Figma, such as setting up frames and nesting them, adding shapes, text, colours, and grids, and creating solid UI designs. Once you're comfortable with the basics, we dive into more advanced subjects like creating solid UI designs and working with components for reusable elements.</p>\n<p>You'll learn how to establish styles and variables for consistency, create responsive designs with auto layout, and add basic prototyping to bring your designs to life&mdash;always keeping collaboration with development in mind.</p>\n<p>With step-by-step exercises and valuable tips and tricks, you'll become proficient in Figma in under 4 hours. It's perfect for beginners or those switching from other design software like Sketch or Adobe XD to Figma.</p>\n<h4>Responsive Design</h4>\n<p>What is auto layout? Adding auto layout Auto layout components and variables Resize settings Auto or space between Nesting auto layout with system Absolute positioning Auto layout pages Constraints in Figma Constraints and grids Which frame size should I use?</p>	https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons	{}	/assets/previews/resource-BHD0kCqs7i-cJSdbXBF5_-preview.png	cm6qp60xn002bmliznf4d8g9l	2023-10-25 00:00:00	2025-02-05 11:15:21.254	Training	cm6qpbpto0000s7tr09q0tf8t
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
cm6tlkwrs000014exwn78tggr	studio@theonlinestudio.co	OLS Accounts	https://lh3.googleusercontent.com/a/ACg8ocLvhtoGJsSy6ti1iZeI0Mnja-ttBga4W0NJuGJUuIsdJ0aZ8vs=s96-c	\N	2025-02-06 17:14:30.761	2025-02-06 17:14:36.605	f	2025-02-06 17:14:36.604
cm6qpbpto0000s7tr09q0tf8t	corin@ols.design	corin	https://lh3.googleusercontent.com/a/ACg8ocJ-b9vysq7JAyc94ZimAPD2ojviacQmCtY9PAfWMEztHP9hO6Hh=s96-c	\N	2025-02-04 16:36:01.789	2025-02-09 15:11:13.548	t	2025-02-09 15:11:13.547
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
cm6qp60xg001ymlizwe6bbmnv	cm6qpbpto0000s7tr09q0tf8t
cm6qp60xm0028mlizi2foexwf	cm6qpbpto0000s7tr09q0tf8t
cm6qp60xk0024mlizsyrzy279	cm6qpbpto0000s7tr09q0tf8t
cm6qp60wj0005mlizowjry6xw	cm6qpbpto0000s7tr09q0tf8t
cm6qp60y50038mlizzbxk24w2	cm6qpbpto0000s7tr09q0tf8t
cm6qp60ye003wmlizyndsdb6o	cm6qpbpto0000s7tr09q0tf8t
\.


--
-- Data for Name: _UserFavorites; Type: TABLE DATA; Schema: public; Owner: corinfogarty
--

COPY public."_UserFavorites" ("A", "B") FROM stdin;
cm6qp60xf001wmlizqrnqr0sy	cm6qpbpto0000s7tr09q0tf8t
cm6qp60xg001ymlizwe6bbmnv	cm6qpbpto0000s7tr09q0tf8t
cm6qp60xj0022mliz03tp0pvh	cm6qpbpto0000s7tr09q0tf8t
cm6qp60ye003wmlizyndsdb6o	cm6qpbpto0000s7tr09q0tf8t
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: corinfogarty
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
1a9cb02d-82b5-4484-a736-e42534b2460e	0cad359678f41fdaa1d3aa51f5eec954dbd88bcb7048966f86500bd04160c49f	2025-02-04 16:29:39.740508+00	20250107171348_init	\N	\N	2025-02-04 16:29:39.678749+00	1
136b03af-6cdb-4d8b-b3fa-9343faf8bbb3	a2d5cbbcd65b6f5f20623a61ca1d3be0192f043dcd15784f0c69d0c5ceb464c3	2025-02-04 16:29:39.744851+00	20250107174325_add_settings_model	\N	\N	2025-02-04 16:29:39.741038+00	1
492397c4-1c55-4bfe-b73d-6920c938be19	dcdb38ef5f3b33bb728bf23179c4fe57ef704d06c718880869763effc32f60ce	2025-02-04 16:29:39.747225+00	20250107174535_add_category_order	\N	\N	2025-02-04 16:29:39.745271+00	1
5f1c3660-5d59-4188-93e3-769789a40723	b02af6a4aa7a4be15a864b17f7436bc1af82b5ed4d59598dc90bc3bae4542919	2025-02-04 16:29:39.750026+00	20250204162140_update_resource_type_to_content_type	\N	\N	2025-02-04 16:29:39.747742+00	1
12b78dcd-2ba4-4a94-92f2-311e4a4687b7	0c79cd5aafd2a853128e101dc49f3f608fa8a13e97d513cba4d110f506a33806	2025-02-06 16:59:14.388385+00	20250206165914_add_submitted_by	\N	\N	2025-02-06 16:59:14.385147+00	1
2185a869-acc0-445b-b995-e81682e89594	41dcfe2572095ed5167608c8c779a048bdd0e80b90a7e9fc5681db4d2f00e7b1	2025-02-06 17:05:52.311216+00	20250206170000_add_default_submitter	\N	\N	2025-02-06 17:05:52.30552+00	1
2aa95e51-50e5-470a-9228-6fa06626c574	f7de352b0509e27e075d48eede48992819c650e911427e41a070dabca3ceed62	2025-02-06 17:06:52.807575+00	20250206170100_add_user_image	\N	\N	2025-02-06 17:06:52.806188+00	1
890f1ba5-1999-49ad-bfab-2f4fa3dbd9ad	a4e4e608261ba4a389e7bd93bf0450f898da03f9e9efc23985f9af8b0b27200e	2025-02-06 17:08:04.95683+00	20250206170200_fix_user_image	\N	\N	2025-02-06 17:08:04.955476+00	1
6b042be5-bf91-4a9d-bf13-49791f9450b2	07c24db2ab2472ec74c3e2de6d90c476861ead718f2f2120b2e62506a3ab96b6	2025-02-08 11:39:54.571967+00	20250207182049_add_plugin_content_type	\N	\N	2025-02-08 11:39:54.571142+00	1
392dcb8c-9c66-4aca-b22b-5d8c4e1b4fb1	0916d526d9f2af71046c7aa30b483ee5751641a8448ee66a442bc91e8f00c899	2025-02-08 11:39:54.769936+00	20250208113954_add_pathways	\N	\N	2025-02-08 11:39:54.764886+00	1
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

