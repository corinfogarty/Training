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
-- Name: Resource; Type: TABLE; Schema: public; Owner: corinfogarty
--

CREATE TABLE public."Resource" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    url text NOT NULL,
    "additionalUrls" text[],
    type public."ResourceType" NOT NULL,
    "previewImage" text,
    "categoryId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
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
cm5nniqb90002140af7ijr5e9	cm5nniqaq0000140ag9kwo3th	oauth	google	109838525694924757686	\N	ya29.a0ARW5m775yuHjSqJ7OFJHNf3LPPEjHpRfUGjZIRSaa4glMQNV46wF2j7ZuKfQSCJb7IuzpSfH-sXEx6TtW4M5JMCXfHTXQ0qboL62WTmTTH1T5fHlIMTjzeza_mkL4rAwqshPobZ3DGqFna5n0gYoAXe6SJXm11vsNuAaCgYKAf0SARMSFQHGX2MiHpnxTtj1iyOOuoSiauA9Bg0170	1736329347	Bearer	https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/userinfo.profile	eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg5Y2UzNTk4YzQ3M2FmMWJkYTRiZmY5NWU2Yzg3MzY0NTAyMDZmYmEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzNzgyNzAxODIzMDAtY2dvOGVnNHRoa2o4bGVkY2JtMXJkdTFmcGQ2dXNnbWQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIzNzgyNzAxODIzMDAtY2dvOGVnNHRoa2o4bGVkY2JtMXJkdTFmcGQ2dXNnbWQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk4Mzg1MjU2OTQ5MjQ3NTc2ODYiLCJoZCI6Im9scy5kZXNpZ24iLCJlbWFpbCI6ImNvcmluQG9scy5kZXNpZ24iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Il9DUmRScmxUQTh0bUF2SGdtdVBhYnciLCJuYW1lIjoiQ29yaW4gRm9nYXJ0eSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKLWI5dnlzcTdKQXljOTRaaW1BUEQyb2p2aWFjUW1DdFk5UEFmV01FenRIUDloTzZIaD1zOTYtYyIsImdpdmVuX25hbWUiOiJDb3JpbiIsImZhbWlseV9uYW1lIjoiRm9nYXJ0eSIsImlhdCI6MTczNjMyNTc0OCwiZXhwIjoxNzM2MzI5MzQ4fQ.YnOcY5NhuX3jEc5QGQKa5XlaScsw76dTKLVlLETkbtEw4Xn8DAJUWIKneMV4vXmvLGJpsIlsjz7hQ9LCraEYtOmzKOe3U6etMc07jiM9FF9gXohlkQL0rEBg_ARUJlHJ8Z2crq_ZSquSPRgDxsugp2Rsh5j9OWqENjm0zwRAw_76rNP9IZlh6jf1wKGSSjKmcZlqMJkk6JA_TiEmLomdJQyH7faJ5vBPDq7LBCtXToc_i-FZMPvqR9XGDowbL8-EpDbC2NefreWlaGpRbWu-ehj3NGyvBerWrU_Gwigmnv6OG7OE6YsNmGS1fwafmOmdXalUVUfebqMqimf_OTXVcg	\N
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
-- Data for Name: Resource; Type: TABLE DATA; Schema: public; Owner: corinfogarty
--

COPY public."Resource" (id, title, description, url, "additionalUrls", type, "previewImage", "categoryId", "createdAt", "updatedAt") FROM stdin;
cm5mv1fv7002hdjyk99jwq8u4	Figma: Beginner to Pro Class | Unit 1: Getting Started	{\n  "title": "",\n  "description": "<p>Class: <a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a>\\nThis lesson starts at 1. Intro</p><p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p><h4>About This Class</h4><p>A beginner's course in UX/UI design with Figma\\nThis course is a comprehensive introduction to Figma from absolute Figma beginner to advanced features. Short and focused, providing you with all you need to know to tackle any design.</p><p>We'll start from scratch by setting up your Figma account and familiarising ourselves with its file structure. Then, we'll dive into the fundamentals of Figma, such as setting up frames and nesting them, adding shapes, text, colours, and grids, and creating solid UI designs. Once you're comfortable with the basics, we dive into more advanced subjects like creating solid UI designs and working with components for reusable elements.</p><p>You'll learn how to establish styles and variables for consistency, create responsive designs with auto layout, and add basic prototyping to bring your designs to life—always keeping collaboration with development in mind.</p><p>With step-by-step exercises and valuable tips and tricks, you'll become proficient in Figma in under 4 hours. It's perfect for beginners or those switching from other design software like Sketch or Adobe XD to Figma.</p><h4>Getting Started</h4><p>1. Getting Figma - Registration Process\\n2. Figma in the Browser vs. Figma App\\n3. The Figma file browser – Figma's home\\n4. Creating design files in Figma</p>",\n  "credentials": {\n    "username": "studio@theonlinestudio.co.uk",\n    "password": "ch4rl0tt3"\n  }\n}	https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons	{}	LINK	https://static.figma.com/app/icon/1/icon-192.png	cm5mv1fv4002bdjykut395pr8	2023-10-25 00:00:00	2025-01-08 10:54:56.348
cm5mv1fu60005djyk2g0jy0z2	Blender Fast Track Part 1: Minecraft	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p><h4>Blender Fast Track Vol 1: Minecraft (Remastered)</h4><p>Start here with this easy-to-follow introduction, where you’ll build a small Minecraft-style scene. Take a broad look at the user interface as you begin to learn the fundamentals of 3D animation and end with a fun destruction simulation!</p>",\n  "credentials": {\n    "username": "corin@theonline.studio",\n    "password": "charlotte"\n  }\n}	https://www.cgfasttrack.com/tutorials/blender-fast-track-vol-1-minecraft-4	{}	LINK	https://download.blender.org/branding/blender_logo_socket.png	cm5mv1fu50003djykd7feowfv	2023-08-31 00:00:00	2025-01-08 10:54:56.57
cm5mv1fw0004gdjykgxbkf5mq	Learn Adobe InDesign: By Creating a Recipe Card	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p><h4>About This Class</h4><p>Learn Adobe InDesign CC for Beginners: Create a Cookbook layout with Grids, Paragraph Styles, Resizing Images, Shortcuts, Content Aware Fit & export it to a PDF. \\nWe will learn a whole bunch of InDesign skills by creating a 2 page spread Recipe Card.\\nIt is especially a great introduction to InDesign's Paragraph & Character Styles- One of the most useful tools for Text and Typography.\\nWhat we will cover:</p><p>Are you ready to create your own Recipe Layout?\\nNote: To download the course files please go to the 'Projects & Resources' Tab</p>",\n  "credentials": {\n    "username": "studio@theonlinestudio.co.uk",\n    "password": "Ch4rl0tt3"\n  },\n  "courseContent": [\n    "---------------------------------------",\n    "Setting up a Document",\n    "Guides",\n    "Shortcuts",\n    "Tools",\n    "Shapes",\n    "Colors for Print/Web",\n    "CMYK / RGB",\n    "Images",\n    "Fit to Frame",\n    "Gridify",\n    "Duplicating",\n    "Typography",\n    "Paragraph & Character Styles",\n    "Saving & Exporting"\n  ]\n}	https://www.skillshare.com/en/classes/Learn-Adobe-InDesign-By-Creating-a-Recipe-Card/920003117?via=search-layout-grid	{}	LINK	https://www.adobe.com/content/dam/cc/icons/indesign.svg	cm5mv1fvy004cdjykj6iy08r3	2023-08-11 00:00:00	2025-01-08 10:55:02.762
cm5mv1fvy004edjykhkqi11b6	Adobe InDesign CC - Essentials Training	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p><p>Overview\\nHi there, my name is  Dan. I am a graphic designer and Adobe Certified Instructor (ACI) for InDesign. We will work with colour, picking your own and also using corporate colours. You will explore how to choose & use fonts like a professional. We will find, resize & crop images for your documents.\\nThere are projects for you to complete, so you can practise your skills & use these for your creative portfolio.\\nIn this course I supply exercise files so you can play along. I will also save my files as I go through each video so that you can compare yours to mine - handy if something goes wrong.\\nKnow that I will be around to help - if you get lost you can drop a post on the video 'Questions and Answers' below each video and I'll be sure to get back to you.\\nI will share every design trick I have learnt in the last 15 years of designing. My goal is for you to finish this course with all the necessary skills to start making beautiful documents using InDesign.</p><p>NOTE: Adobe InDesign CC 2018 or above recommended.  \\nExercise files: <a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a>\\nCompleted files: <a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p>",\n  "credentials": {\n    "username": "studio@theonlinestudio.co.uk",\n    "password": "Ch4rl0tt3"\n  },\n  "courseContent": [\n    "---------------------------------------"\n  ]\n}	https://www.skillshare.com/en/classes/Adobe-InDesign-CC-Essentials-Training-Course/1170360090/projects?via=search-layout-grid	{https://www.dropbox.com/s/ec9i80lq45bi3ny/Exercise%20Files%20-%20InDesign%20Essentials.zip?dl=0,https://www.dropbox.com/sh/plsvikpfrxt5the/AADBe0OeFxiwaDSEgDm0Q4via?dl=0}	LINK	https://www.dropbox.com/static/metaserver/static/images/opengraph/opengraph-content-icon-file-zip-landscape.png	cm5mv1fvy004cdjykj6iy08r3	2023-08-09 00:00:00	2025-01-08 10:55:06.749
cm5mv1fvh0031djyk798222yi	Beginner to Pro Class | Unit 6: Basic Prototyping	{\n  "title": "",\n  "description": "<p>Class: <a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a>\\nThis lesson starts at 50. PROTOTYPING - 01 The Figma prototype workspace</p><h4>About This Class</h4><p>A beginner's course in UX/UI design with Figma\\nThis course is a comprehensive introduction to Figma from absolute Figma beginner to advanced features. Short and focused, providing you with all you need to know to tackle any design.</p><p>We'll start from scratch by setting up your Figma account and familiarising ourselves with its file structure. Then, we'll dive into the fundamentals of Figma, such as setting up frames and nesting them, adding shapes, text, colours, and grids, and creating solid UI designs. Once you're comfortable with the basics, we dive into more advanced subjects like creating solid UI designs and working with components for reusable elements.</p><p>You'll learn how to establish styles and variables for consistency, create responsive designs with auto layout, and add basic prototyping to bring your designs to life—always keeping collaboration with development in mind.</p><p>With step-by-step exercises and valuable tips and tricks, you'll become proficient in Figma in under 4 hours. It's perfect for beginners or those switching from other design software like Sketch or Adobe XD to Figma.</p><h4>Basic Prototyping</h4><p>Prototyping in Figma\\n    Setting scroll behaviour\\n    Connecting screens\\n    Dropdown menu with overlays\\n    Animation types\\n    Interactive components\\n    Figma Mirror – Preview on your device</p>",\n  "credentials": {\n    "username": "studio@theonlinestudio.co.uk",\n    "password": "ch4rl0tt3"\n  }\n}	https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons	{}	LINK	https://static.figma.com/app/icon/1/icon-192.png	cm5mv1fv4002bdjykut395pr8	2023-10-25 00:00:00	2025-01-08 10:54:56.665
cm5mv1fub000edjykoh7mv0j6	3D Work	{\n  "title": "",\n  "description": "<h4>No description provided</h4>",\n  "credentials": {}\n}	#pending	{}	LINK	https://download.blender.org/branding/blender_logo_socket.png	cm5mv1fu50003djykd7feowfv	2023-01-24 00:00:00	2025-01-08 10:54:56.666
cm5mv1fv9002ldjykz20dotei	Beginner to Pro Class | Unit 2: Figma Basics	{\n  "title": "",\n  "description": "<p>Class: <a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a>\\nThis lesson starts at 7. BASICS - 01 Adding frames to our file</p><h4>About This Class</h4><p>A beginner's course in UX/UI design with Figma\\nThis course is a comprehensive introduction to Figma from absolute Figma beginner to advanced features. Short and focused, providing you with all you need to know to tackle any design.</p><p>We'll start from scratch by setting up your Figma account and familiarising ourselves with its file structure. Then, we'll dive into the fundamentals of Figma, such as setting up frames and nesting them, adding shapes, text, colours, and grids, and creating solid UI designs. Once you're comfortable with the basics, we dive into more advanced subjects like creating solid UI designs and working with components for reusable elements.</p><p>You'll learn how to establish styles and variables for consistency, create responsive designs with auto layout, and add basic prototyping to bring your designs to life—always keeping collaboration with development in mind.</p><p>With step-by-step exercises and valuable tips and tricks, you'll become proficient in Figma in under 4 hours. It's perfect for beginners or those switching from other design software like Sketch or Adobe XD to Figma.</p><h4>Figma Basics</h4><p>Adding frames to our file\\n    A few handy shortcuts\\n    Design file overview\\n    Adding shapes and colour\\n    Size menu – manipulating shapes and frames\\n    Align, tidy up, and measure\\n    Adding and working with text\\n    Nesting frames – The Figma superpower\\n    Frames vs Groups\\n    Designing with nested frames\\n    Re-usable grids with styles\\n    Figma Community and Plugins\\n    Adding images\\n    Drawing in Figma\\n    Scaling in Figma</p>",\n  "credentials": {\n    "username": "studio@theonlinestudio.co.uk",\n    "password": "ch4rl0tt3"\n  }\n}	https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons	{}	LINK	https://static.figma.com/app/icon/1/icon-192.png	cm5mv1fv4002bdjykut395pr8	2023-10-25 00:00:00	2025-01-08 10:54:56.774
cm5nsqzuo0001iytnsqhog2go	OLS	{"title":"OLS","description":"<p>The online studio site</p>","credentials":{},"courseContent":[]}	https://ols.design	\N	VIDEO	https://ols.design/012103784.png	cm5mv1fvw0047djykpxp237vj	2025-01-08 11:08:52.608	2025-01-08 11:08:52.608
cm5mv1fvj0038djykp1epzubx	Learn After Effects in 2 h	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p><h4>About This Class</h4><p>Learn Adobe After Effects In only TWO Hours!\\nHave you ever thought of becoming a Motion Graphics Designer or Visual Effects Artist?\\nEver wanted to create your own Animations or Cartoons or wanted to know how to create your own amazing Visual Effects / Special Effects (VFX)? Well now you can! - In just 2 Hours!\\nAdobe After Effects is seen as the industry standard when it comes to Motion Graphics, Visual Effects (VFX) and Animation. During the following two hours you will learn all the basics and even some advanced techniques using this amazing application! Learn these 22 lessons and you will be able to create anything that you can imagine!</p><p>What will you learn?\\n    The Interface\\n    FX Console\\n    Keeping Things Neat And Tidy\\n    Importing Assets In To After Effects\\n    Creating Your First Composition\\n    Working With 2D Layers\\n    Working With 3D Layers\\n    Adding Effects To Layers\\n    Creating Text In After Effects\\n    Animation Basics And Keyframes\\n    The Pivot Point\\n    Layer Parenting\\n    Working With Solids\\n    Null Objects\\n    Pre Composing Layers\\n    Rotoscoping And Masks\\n    Adjustment Layers\\n    Green Screen and Chroma Keying\\n    2D Motion Tracking\\n    3D Camera Tracking\\n    Adding Motion Blur\\n    Rendering From After Effects</p><p>All this is just 2 HOURS!\\nGood luck and have lots of fun!\\nPlease upload your class project deliverable as mp4 to the Skillshare project gallery for review! You can find the details regarding the project under Class Project.</p>",\n  "credentials": {\n    "username": "studio@theonlinestudio.co.uk",\n    "password": "ch4rl0tt3"\n  },\n  "courseContent": [\n    "---------------------------------------"\n  ]\n}	https://www.skillshare.com/en/classes/Learn-After-Effects-In-Only-Two-Hours/1982651597/projects?via=user-profile	{}	LINK	https://www.adobe.com/content/dam/cc/icons/aftereffects.svg	cm5mv1fvj0036djyka2842mc8	2023-08-31 00:00:00	2025-01-08 10:54:56.87
cm5nta9av0003iytndbl6j4fi	test	{"title":"test","description":"<p>test</p>","credentials":{},"courseContent":[]}	https://facebook.com	\N	VIDEO	\N	cm5mv1fvw0047djykpxp237vj	2025-01-08 11:23:51.319	2025-01-08 11:23:51.319
cm5mv1fuz001wdjykvkyewxas	Blender Fast Track Part 2: Sword in the Stone	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p><p>Blender Fast Track Vol 2: Sword in the Stone (Remastered)</p><p>Dive deeper into Blender as you build out this epic Sword in the Stone scene. Go through the essentials of polygon modeling, shader nodes, building out an environment, and geometry nodes. Learn the basics while sidestepping the pitfalls of standard tutorials as you build a thrilling fantasy world.</p>",\n  "credentials": {\n    "username": "corin@theonline.studio",\n    "password": "charlotte"\n  }\n}	https://www.cgfasttrack.com/tutorials/sword-in-the-stone-4	{}	LINK	https://download.blender.org/branding/blender_logo_socket.png	cm5mv1fu50003djykd7feowfv	2023-07-14 00:00:00	2025-01-08 10:54:56.974
cm5mv1fv00020djyksf72w41q	Blender Fast Track Part 4: UV and Image Projections	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p><h4>UV and Image Projections in Blender (Remastered)</h4><p>Learn a quick way to apply 2D image textures to your 3D models using flat and box image projection techniques. Gain more control over your image textures by learning the fundamentals of UV unwrapping workflows.</p>",\n  "credentials": {\n    "username": "corin@theonline.studio",\n    "password": "charlotte"\n  }\n}	https://www.cgfasttrack.com/tutorials/uv-and-image-projections-in-blender-4-0	{}	LINK	https://download.blender.org/branding/blender_logo_socket.png	cm5mv1fu50003djykd7feowfv	2023-07-14 00:00:00	2025-01-08 10:54:57.031
cm5mv1fuz001ydjykg2dpe5tr	Blender Fast Track Part 3: Modeling Fundamentals	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p><h4>Modeling Fundamentals in Blender (Remastered)</h4><p>Dive deep into the building blocks of 3D. In this series you’ll explore Blender’s modeling tools and learn essential modeling workflows while you construct a magical environment.</p>",\n  "credentials": {\n    "username": "corin@theonline.studio",\n    "password": "charlotte"\n  }\n}	https://www.cgfasttrack.com/tutorials/fund4-modeling	{}	LINK	https://download.blender.org/branding/blender_logo_socket.png	cm5mv1fu50003djykd7feowfv	2023-07-14 00:00:00	2025-01-08 10:54:57.097
cm5mv1fv10024djyk2upx0ejy	Blender Fast Track Part 6: Animation Fundamentals in Blender	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p><h4>Animation Fundamentals in Blender</h4><p>Get ready to animate! In this tutorial for animation beginners, you'll learn the basics of keyframing tools. Bring your scenes to life by learning to create believable, dynamic sequences using the principles of animation. Jet kit included!</p>",\n  "credentials": {\n    "username": "corin@theonline.studio",\n    "password": "charlotte"\n  }\n}	https://www.cgfasttrack.com/tutorials/blender-animation-fundamentals	{}	LINK	https://download.blender.org/branding/blender_logo_socket.png	cm5mv1fu50003djykd7feowfv	2023-07-14 00:00:00	2025-01-08 10:54:57.153
cm5nte7oc0005iytnelwgho9a	seasons greetings	{"title":"seasons greetings","description":"<p>here it is</p>","credentials":{},"courseContent":[]}	https://ols.design/landing/seasonsgreetings	\N	IMAGE	https://creative.ols.design/Website/Images/Landing/Share/creators-social.png	cm5mv1fw1004hdjykh8ifk8x9	2025-01-08 11:26:55.835	2025-01-08 11:26:55.835
cm5mv1fv30028djykh4yk11ss	First Steps with Blender 2.80	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p>",\n  "credentials": {}\n}	https://www.youtube.com/watch?v=MF1qEhBSfq4&list=PLa1F2ddGya_-UvuAqHAksYnB0qL9yWDO6&index=1	{}	LINK	https://i.ytimg.com/vi/MF1qEhBSfq4/maxresdefault.jpg	cm5mv1fu50003djykd7feowfv	2023-07-14 00:00:00	2025-01-08 10:54:57.154
cm5mv1fvw0049djykfsbhjl28	Fundamentals for Beginners | 1:20 h	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p><h4>About This Class</h4><p>Want to create clean and professional graphics? Learn how with designer Anne Bracker in this beginner’s guide to Adobe Illustrator!</p><p>In this concise and comprehensive introduction, Anne walks you through everything you need to know in order to get started with Adobe Illustrator. You’ll learn how to customize your workspace and speed up your workflow with keyboard shortcuts, then you'll dive straight into the three core elements of Illustrator: shapes, paths and type. By the end of the class, you’ll have the essential tools and techniques needed to create any type of graphic. Key skills include:</p><p>Building objects with simple shapes\\n    Applying colors and creating swatches\\n    Drawing curves with the Pen Tool\\n    Making designs with custom type\\n    \\nWhether you’re opening up Illustrator for the first time or need a refresher on the basics, this class is for you. By the end, you’ll know how to navigate the platform and take advantage of its powerful features so you can start your own projects.</p>",\n  "credentials": {\n    "username": "studio@theonlinestudio.co.uk",\n    "password": "ch4rl0tt3"\n  },\n  "courseContent": [\n    "---------------------------------------"\n  ]\n}	https://www.skillshare.com/en/classes/Learn-Adobe-Illustrator-Fundamentals-for-Beginners/808971532?via=search-layout-grid	{}	LINK	https://www.adobe.com/content/dam/cc/icons/illustrator.svg	cm5mv1fvw0047djykpxp237vj	2023-07-28 00:00:00	2025-01-08 10:54:57.247
cm5mv1fv3002adjykiqk25l4e	Misc Blender Tutorials	{\n  "title": "",\n  "description": "<h4>No description provided</h4>",\n  "credentials": {}\n}	#pending	{}	LINK	https://download.blender.org/branding/blender_logo_socket.png	cm5mv1fu50003djykd7feowfv	2024-03-14 00:00:00	2025-01-08 10:54:57.248
cm5mv1fv20026djyk7d3xw7z6	Blender Fast Track Part 7: The Art of Lighting	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p><h4>The Art of Lighting in Blender</h4><p>Discover the art of lighting beautiful digital worlds in this introductory series. Learn these powerful artistic techniques and apply them while you create eye-catching renders in this easy-to-follow series.</p>",\n  "credentials": {\n    "username": "corin@theonline.studio",\n    "password": "charlotte"\n  }\n}	https://www.cgfasttrack.com/tutorials/the-art-of-lighting-in-blender	{}	LINK	https://download.blender.org/branding/blender_logo_socket.png	cm5mv1fu50003djykd7feowfv	2023-07-14 00:00:00	2025-01-08 10:54:57.311
cm5nuj7a60007iytnwmv6qvi0	OLS – create MORE!	Expand your design capabilities & unleash your big ideas with OLS. Access amazing creative talent, scale up your campaigns and create awesome content.	https://ols.design/	\N	LINK	\N	cm5mv1fw1004hdjykh8ifk8x9	2025-01-08 11:58:48.223	2025-01-08 11:58:48.223
cm5mv1fvt0040djyk0iw5lfxr	Motion Beast	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p><p>Congratulations and welcome to the Motion Beast course. You’ve made the right choice and there is a wonderful adventure in motion design waiting for you ahead. Let’s see what you need to take with you on that journey, so that you can reach the final destination and become a real Motion Beast.</p><p>So, if you’ve opened this page hoping to discover an easy and quick way to achieve your goal — you’re in the right place. This is so obvious that everyone around you already knows about it. If you want to achieve success in animation, 3D modeling, video production or anything else, the main thing you need to do is to practice as much as possible.</p>",\n  "credentials": {\n    "username": "studio@theonlinestudio.co.uk",\n    "password": "Ch4rl0tt3"\n  },\n  "courseContent": [\n    "---------------------------------------"\n  ]\n}	https://motiondesign.school/lessons/introduction-20/	{}	LINK	https://cdn.motiondesign.school/uploads/2021/04/cover2.jpg	cm5mv1fvj0036djyka2842mc8	2023-08-11 00:00:00	2025-01-08 10:55:01.643
cm5mv1fvc002pdjyksbupcqfp	Beginner to Pro Class | Unit 3: Introducing Components	{\n  "title": "",\n  "description": "<p>Class: <a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a>\\nThis lesson starts at 23. COMPONENTS - 01 Re-use elements with components and instances</p><h4>About This Class</h4><p>A beginner's course in UX/UI design with Figma\\nThis course is a comprehensive introduction to Figma from absolute Figma beginner to advanced features. Short and focused, providing you with all you need to know to tackle any design.</p><p>We'll start from scratch by setting up your Figma account and familiarising ourselves with its file structure. Then, we'll dive into the fundamentals of Figma, such as setting up frames and nesting them, adding shapes, text, colours, and grids, and creating solid UI designs. Once you're comfortable with the basics, we dive into more advanced subjects like creating solid UI designs and working with components for reusable elements.</p><p>You'll learn how to establish styles and variables for consistency, create responsive designs with auto layout, and add basic prototyping to bring your designs to life—always keeping collaboration with development in mind.</p><p>With step-by-step exercises and valuable tips and tricks, you'll become proficient in Figma in under 4 hours. It's perfect for beginners or those switching from other design software like Sketch or Adobe XD to Figma.</p><h4>Introducing Components</h4><p>Re-use elements with components and instances\\n    Overriding instances\\n    What to override and what not to\\n    Reverting components and overrides\\n    Nest components\\n    Component sets with variants\\n    Move components to their own page\\n    Keeping components organised\\n    Advanced component features introduction</p>",\n  "credentials": {\n    "username": "studio@theonlinestudio.co.uk",\n    "password": "ch4rl0tt3"\n  }\n}	https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons	{}	LINK	https://static.figma.com/app/icon/1/icon-192.png	cm5mv1fv4002bdjykut395pr8	2023-10-25 00:00:00	2025-01-08 10:55:02.084
cm5nuk5y40009iytnvm536d2n	BBC - Home	The best of the BBC, with the latest news and sport headlines, weather, TV &amp; radio highlights and much more from across the whole of BBC Online.	https://www.bbc.co.uk/	\N	LINK	\N	cm5mv1fw1004hdjykh8ifk8x9	2025-01-08 11:59:33.149	2025-01-08 11:59:33.149
cm5mv1fvl003edjykst78ifgz	Text Animators: Custom Text Animation in Adobe After Effects	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p><p>About This Class\\nLearn how to create custom text animations with text animators: After Effects’ built-in system specifically designed to animate text.</p><p>If you create motion graphics or videos of any kind, being able to animate text is a necessity.\\nUsing text animators, you have numerous options for animating each letter, word, or line of text. It’s quick to set up and easy to edit what the text says even after you’ve created the animation. Plus, you can save the animation as a preset so you can easily reuse it on any text layer, in any After Effects project; no need to recreate or even import anything. You can even share text animation presets with others.</p><p>What you’ll learn:\\n    How text animators work\\n    What different text animator options and controllers do\\n    What Selector Shapes do and how to animate with the Range Selector\\n    What properties can be animated\\n    How to adjust easing on text animators\\n    How to use multiple text animators for more complex animations\\n    When to use the Wiggly Selector\\n    How to make text 3D (using After Effects)\\n    How to save your custom text animators as a preset\\nPlus, I’ll show you 8 different examples that demonstrate a wide range of possibilities. Using what you learn, you’ll be able to create your own unique text animations.</p><p>Included with this class:\\n    An After Effects project file with guides to help you visualize what different text animator options and controllers do\\n    6 text animator presets\\n    \\nWho this class is for:\\nText animators work a little differently than other types of animation in After Effects. This means that if you already have experience with After Effects animation, but haven’t touched text animators, you’ll get a lot out of this class. It also means that you don’t need to know a ton about After Effects to be successful. Before taking this class you should know some After Effects basics like how to create a composition and set keyframes.</p>",\n  "credentials": {\n    "username": "studio@theonlinestudio.co.uk",\n    "password": "ch4rl0tt3"\n  },\n  "courseContent": [\n    "---------------------------------------"\n  ]\n}	https://www.skillshare.com/en/classes/Text-Animators-Custom-Text-Animation-in-Adobe-After-Effects/1739980266?via=search-layout-grid	{}	LINK	https://www.adobe.com/content/dam/cc/icons/aftereffects.svg	cm5mv1fvj0036djyka2842mc8	2023-07-28 00:00:00	2025-01-08 10:55:02.481
cm5mv1fv5002ddjyki19nd1q7	Create a Basic Asset	{\n  "title": "",\n  "description": "<p>Follow Felipes First session to create a basic OLS social asset.</p><p>You can watch the video <a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p><p>You can look at the workbook <a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p><p>You can find the assets to duplicate <a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p><p>Please go to <a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a> of the workbook and follow the instructions on how this board works and how to get your own basic Figma template to practice with.</p>",\n  "credentials": {}\n}	https://drive.google.com/drive/folders/1u-C0zOJYEb7oQvwKlYKHQsJ3a-JqILn-	{https://docs.google.com/presentation/d/1hmx0TaaD4uxJp-nj_vxBW1eUC6ZEMZxXiRGcdiYCH5U/edit?usp=sharing,https://www.figma.com/file/h2NcHyaFQGOZKmI59g3ShG/Session-One%3A-Create-a-Basic-Asset?type=design&node-id=0%3A1&t=IFHay2mSytRu9BV3-1,https://docs.google.com/presentation/d/1hmx0TaaD4uxJp-nj_vxBW1eUC6ZEMZxXiRGcdiYCH5U/edit#slide=id.g2403a29dede_0_275}	LINK	https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/h2NcHyaFQGOZKmI59g3ShG	cm5mv1fv4002bdjykut395pr8	2023-04-28 00:00:00	2025-01-08 10:55:04.3
cm5mv1fv10022djykzzfhgxau	Blender Fast Track Part 5: Texturing and Shading Fundamentals	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p><p>Texturing and Shading Fundamentals in Blender (Remastered)</p><p>Learn to transform your models to a fully textured and shaded scene by utilizing the shader editor. You'll learn how to create consistent, believable worlds with these production techniques.</p>",\n  "credentials": {\n    "username": "corin@theonline.studio",\n    "password": "charlotte"\n  }\n}	https://www.cgfasttrack.com/tutorials/texturing-and-shading-fundamentals-in-blender-4-0	{}	LINK	https://download.blender.org/branding/blender_logo_socket.png	cm5mv1fu50003djykd7feowfv	2023-07-14 00:00:00	2025-01-08 10:55:04.497
cm5nv6073000biytn8p180dbj	Amazon.co.uk: Low Prices in Electronics, Books, Sports Equipment & more	Sign up to Amazon Prime for unlimited free delivery. Low prices at Amazon on digital cameras, MP3, sports, books, music, DVDs, video games, home & garden and much more.	https://www.amazon.co.uk/	\N	LINK	\N	cm5mv1fw1004hdjykh8ifk8x9	2025-01-08 12:16:32.126	2025-01-08 12:16:32.126
cm5mv1fvr003wdjykx5ckqczf	11 Expressions for Animation Efficiency in Adobe After Effects | 1:10 h	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p><h4>About This Class</h4><p>Unlock a powerful side of Adobe After Effects where code controls animation. Learn 11 different expressions to automate animations, eliminate excessive keyframes, achieve complex effects, and work more efficiently; no programming experience needed!</p><p>An expression is a short block of code, written in JavaScript that modifies an animatable property. Expressions can be useful in many different cases in motion design:\\n    Create continuous, repetitive, or reactive motion\\n    Automate animations\\n    Avoid excessive keyframes\\n    Set up rigs</p><p>This class covers 11 different expressions so you can understand what they do and how to use them, without actually needing to learn how to write JavaScript. Plus, I’ll provide examples of how I use expressions in real projects. You’ll be able to start using these expressions in your animations to work more efficiently and achieve effects that would have been extremely tedious or impossible before.</p><p>In future classes, once you’ve gotten comfortable using these expressions in your work, you can move on to learning how to write your own expressions. This class is a perfect intro into the advanced topic of expressions which can open up a whole new, customisable side of Adobe After Effects.</p><h4>Who this class is for:</h4><p>This class is for motion designers who are comfortable with the basics of Adobe After Effects and want to take their workflow to the next level. No programming experience is needed!</p><h4>What you should know before taking this class:</h4><p>Adobe After Effects basics like creating compositions, setting keyframes, rendering, etc.\\n    How to connect (parent) layers and properties\\n    How to apply an effect to a layer\\n    How to animate the path of a shape\\n    How to add easing to keyframes and use the graph editor to adjust the spacing of an animation</p>",\n  "credentials": {\n    "username": "studio@theonlinestudio.co.uk",\n    "password": "ch4rl0tt3"\n  },\n  "courseContent": [\n    "---------------------------------------"\n  ]\n}	https://www.skillshare.com/en/classes/11-Expressions-for-Animation-Efficiency-in-Adobe-After-Effects/451087798?via=search-layout-grid	{}	LINK	https://www.adobe.com/content/dam/cc/icons/aftereffects.svg	cm5mv1fvj0036djyka2842mc8	2023-11-24 00:00:00	2025-01-08 10:55:04.591
cm5mv1fvd002tdjykipke7u4k	Beginner to Pro Class | Unit 4: Variables and Styles	{\n  "title": "",\n  "description": "<p>Class: <a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a>\\nThis lesson starts at 32. VARIABLES - 01 Introduction to variables</p><h4>About This Class</h4><p>A beginner's course in UX/UI design with Figma\\nThis course is a comprehensive introduction to Figma from absolute Figma beginner to advanced features. Short and focused, providing you with all you need to know to tackle any design.</p><p>We'll start from scratch by setting up your Figma account and familiarising ourselves with its file structure. Then, we'll dive into the fundamentals of Figma, such as setting up frames and nesting them, adding shapes, text, colours, and grids, and creating solid UI designs. Once you're comfortable with the basics, we dive into more advanced subjects like creating solid UI designs and working with components for reusable elements.</p><p>You'll learn how to establish styles and variables for consistency, create responsive designs with auto layout, and add basic prototyping to bring your designs to life—always keeping collaboration with development in mind.</p><p>With step-by-step exercises and valuable tips and tricks, you'll become proficient in Figma in under 4 hours. It's perfect for beginners or those switching from other design software like Sketch or Adobe XD to Figma.</p><h4>Variables and Styles</h4><p>Introduction to variables\\n    Working with colour variables\\n    Organising with variable collections and groups\\n    Size and spacing variables\\n    And what about styles?\\n    Typography and styles\\n    Documenting variables and styles</p>",\n  "credentials": {\n    "username": "studio@theonlinestudio.co.uk",\n    "password": "ch4rl0tt3"\n  }\n}	https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons	{}	LINK	https://static.figma.com/app/icon/1/icon-192.png	cm5mv1fv4002bdjykut395pr8	2023-10-25 00:00:00	2025-01-08 10:55:06.86
cm5nv8knn000diytny6r7ao4c	Training Hub	{\n  "title": "Training Hub",\n  "description": "<p>A platform for organizing training resources</p>",\n  "credentials": {},\n  "courseContent": [],\n  "previewImage": "",\n  "url": "http://localhost:3000/"\n}	http://facebook.com	\N	LINK		cm5mv1fw1004hdjykh8ifk8x9	2025-01-08 12:18:31.955	2025-01-08 12:19:01.776
cm5nvahi6000fiytnu843lcdl	BBC - Home	{"title":"BBC - Home","description":"The best of the BBC, with the latest news and sport headlines, weather, TV &amp; radio highlights and much more from across the whole of BBC Online.","credentials":{},"courseContent":[],"previewImage":"https://static.files.bbci.co.uk/core/website/assets/static/webcore/bbc_blocks_84x24.5b565ac136ea8f9cb3b0f8e02eca1e0f.svg","url":"https://www.bbc.co.uk/"}	https://www.bbc.co.uk/	\N	LINK	https://static.files.bbci.co.uk/core/website/assets/static/webcore/bbc_blocks_84x24.5b565ac136ea8f9cb3b0f8e02eca1e0f.svg	cm5mv1fw1004hdjykh8ifk8x9	2025-01-08 12:20:01.182	2025-01-08 12:20:01.182
cm5mv1fvf002xdjyk8t9zjjn9	Beginner to Pro Class | Unit 5: Responsive Design	{\n  "title": "",\n  "description": "<p>Class: <a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a>\\nThis lesson starts at 39. RESPONSIVE - 01 What is auto layout?</p><h4>About This Class</h4><p>A beginner's course in UX/UI design with Figma\\nThis course is a comprehensive introduction to Figma from absolute Figma beginner to advanced features. Short and focused, providing you with all you need to know to tackle any design.</p><p>We'll start from scratch by setting up your Figma account and familiarising ourselves with its file structure. Then, we'll dive into the fundamentals of Figma, such as setting up frames and nesting them, adding shapes, text, colours, and grids, and creating solid UI designs. Once you're comfortable with the basics, we dive into more advanced subjects like creating solid UI designs and working with components for reusable elements.</p><p>You'll learn how to establish styles and variables for consistency, create responsive designs with auto layout, and add basic prototyping to bring your designs to life—always keeping collaboration with development in mind.</p><p>With step-by-step exercises and valuable tips and tricks, you'll become proficient in Figma in under 4 hours. It's perfect for beginners or those switching from other design software like Sketch or Adobe XD to Figma.</p><h4>Responsive Design</h4><p>What is auto layout?\\n    Adding auto layout\\n    Auto layout components and variables\\n    Resize settings\\n    Auto or space between\\n    Nesting auto layout with system\\n    Absolute positioning\\n    Auto layout pages\\n    Constraints in Figma\\n    Constraints and grids\\n    Which frame size should I use?</p>",\n  "credentials": {\n    "username": "studio@theonlinestudio.co.uk",\n    "password": "ch4rl0tt3"\n  }\n}	https://www.skillshare.com/en/classes/NEW-Figma-2023-Beginner-to-Pro-Class-in-under-4h/1399003407/lessons	{}	LINK	https://static.figma.com/app/icon/1/icon-192.png	cm5mv1fv4002bdjykut395pr8	2023-10-25 00:00:00	2025-01-08 10:55:06.952
cm5mv1fvi0035djykfz3zzqm6	Components 0 to 1 Practice & Cheat Sheet	{\n  "title": "",\n  "description": "<p>Become a master at creating and using Figma Components, Instances and Variants with these simple exercises.</p><p><a href=\\"(Community)?type=design&node-id=1-2&mode=design&t=y00RG2GPpYfas7sO-0\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">(Community)?type=design&node-id=1-2&mode=design&t=y00RG2GPpYfas7sO-0</a></p>",\n  "credentials": {}\n}	https://www.figma.com/file/VTXwD8IniSXgBEjYuFjrvi/Component-Practice-%26-Cheat-Sheet-(Community)?type=design&node-id=1-2&mode=design&t=y00RG2GPpYfas7sO-0	{https://www.figma.com/file/VTXwD8IniSXgBEjYuFjrvi/Component-Practice-%26-Cheat-Sheet-}	LINK	https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/VTXwD8IniSXgBEjYuFjrvi	cm5mv1fv4002bdjykut395pr8	2023-07-14 00:00:00	2025-01-08 10:55:06.954
cm5mv1fvu0044djyk3ftkh2zg	Fundamentals on UI Animation in After Effects	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p><p>Welcome!\\nHello and welcome to the course on interface animation in After Effects. Five fascinating lessons are waiting for you. Whatever skill level you have, you’ll find something new and useful for yourself. Let’s check it out 😉\\nFor each lesson we’ve prepared a set of tools and techniques. So, read every document attentively before you start working.</p>",\n  "credentials": {\n    "username": "studio@theonlinestudio.co.uk",\n    "password": "Ch4rl0tt3"\n  },\n  "courseContent": [\n    "---------------------------------------"\n  ]\n}	https://motiondesign.school/courses/fundamentals-on-ui-animation-in-after-effects/	{}	LINK	https://cdn.motiondesign.school/uploads/2021/06/ui_free_title_update.png	cm5mv1fvj0036djyka2842mc8	2023-08-11 00:00:00	2025-01-08 10:55:08.219
cm5mv1fvo003kdjykps9u3jad	Mocha for Beginners: Screen Replacements | 27 min	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p><h4>About This Class</h4><p>As a motion graphics artist, there’s one request that you will always get: screen replacements! Whether it’s a laptop, cellphone, or TV, you need to know how to quickly and accurately track and matte your screen. This short course will help you learn the basics so that you can approach your next screen replacement with confidence!</p><p>This class is for anyone, with at least a little experience in After Effects, who wants to get started using Mocha. This tracking technique has countless applications, and I hope it helps with your compositing workflow!</p>",\n  "credentials": {\n    "username": "studio@theonlinestudio.co.uk",\n    "password": "ch4rl0tt3"\n  },\n  "courseContent": [\n    "---------------------------------------"\n  ]\n}	https://www.skillshare.com/en/classes/After-Effects-Mocha-for-Beginners-Screen-Replacements/751144017/lessons	{}	LINK	https://www.adobe.com/content/dam/cc/icons/aftereffects.svg	cm5mv1fvj0036djyka2842mc8	2023-11-24 00:00:00	2025-01-08 10:55:08.322
cm5mv1fvq003sdjykgqax8tfy	Water surface animation for a still image | 5 min	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p><h4>About This Class</h4><p>You will learn how to make the water in still photos or paintings move like real water.</p>",\n  "credentials": {},\n  "courseContent": [\n    "---------------------------------------"\n  ]\n}	https://www.youtube.com/watch?v=_J-sOi1iacg	{}	LINK	https://i.ytimg.com/vi/_J-sOi1iacg/maxresdefault.jpg	cm5mv1fvj0036djyka2842mc8	2023-11-24 00:00:00	2025-01-08 10:55:08.324
cm5mv1fvp003odjyk49pr6qxu	Twinkling Stars  | 2 min	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p><h4>About This Class</h4><p>You will learn how to use CC Particle World to create a Twinkling Stars sky</p>",\n  "credentials": {},\n  "courseContent": [\n    "---------------------------------------"\n  ]\n}	https://www.youtube.com/watch?v=S_kx93-ucWE&t=45s	{}	LINK	https://i.ytimg.com/vi/S_kx93-ucWE/maxresdefault.jpg	cm5mv1fvj0036djyka2842mc8	2023-11-24 00:00:00	2025-01-08 10:55:08.325
cm5mv1fwc005fdjykkbzgcktt	Master Shadows & Lighting in Compositing with Photoshop!	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p>",\n  "credentials": {}\n}	https://www.youtube.com/watch?v=Da4axkDKzxQ	{}	LINK	https://i.ytimg.com/vi/Da4axkDKzxQ/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-07-07 00:00:00	2025-01-08 10:55:08.326
cm5mv1fw1004jdjyk52gz4t7h	How to make Transparent Glass in Photoshop	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p>",\n  "credentials": {}\n}	https://www.youtube.com/watch?v=sSDQM_6igQo	{}	LINK	https://i.ytimg.com/vi/sSDQM_6igQo/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2024-10-11 00:00:00	2025-01-08 10:55:08.328
cm5mv1fw4004pdjykswja81h8	3 Ways to Add Depth to Your Composite in Photoshop!	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p>",\n  "credentials": {}\n}	https://www.youtube.com/watch?v=YqQ6yxclfWA	{}	LINK	https://i.ytimg.com/vi/YqQ6yxclfWA/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2023-04-09 00:00:00	2025-01-08 10:55:08.33
cm5mv1fw2004ldjykwt42foo5	How to Use Sky Replacement Tool effectively	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p>",\n  "credentials": {}\n}	https://www.youtube.com/watch?v=ognLpUNLDwM	{}	LINK	https://i.ytimg.com/vi/ognLpUNLDwM/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2023-09-28 00:00:00	2025-01-08 10:55:08.333
cm5mv1fw5004tdjykpabnn1ao	How to Create ''Microworlds''	{\n  "title": "",\n  "description": "<p>How I Create ''Microworlds''\\n<a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p>",\n  "credentials": {}\n}	https://www.youtube.com/watch?v=Z6yXBh7WsKo	{}	LINK	https://i.ytimg.com/vi/Z6yXBh7WsKo/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-03-31 00:00:00	2025-01-08 10:55:08.334
cm5mv1fwi005xdjykclbpl60u	Understanding Depth Of Field	{\n  "title": "",\n  "description": "<p>Understanding Depth Of Field\\n<a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p>",\n  "credentials": {}\n}	https://www.skillshare.com/classes/Understanding-Depth-Of-Field/787298081?via=search-layout-grid	{}	LINK	https://www.adobe.com/content/dam/cc/us/en/creativecloud/ps_cc_app_RGB.svg	cm5mv1fw1004hdjykh8ifk8x9	2021-03-31 00:00:00	2025-01-08 10:55:08.443
cm5mv1fwq006jdjyk04kybxce	Changing Colours using HSB Values	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p>",\n  "credentials": {}\n}	https://www.youtube.com/watch?v=Anto0kf2kuA&t=442s	{}	LINK	https://i.ytimg.com/vi/Anto0kf2kuA/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-06-28 00:00:00	2025-01-08 10:55:08.445
cm5mv1fx5007pdjyk02ibvir6	Realistic Shallow Depth of Field Effect Using Depth Maps	{\n  "title": "",\n  "description": "<p>Photoshop Tutorial: Realistic Shallow Depth of Field Effect Using Depth Maps\\n<a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p>",\n  "credentials": {}\n}	https://www.youtube.com/watch?v=sKKhuOXwAAk	{}	LINK	https://i.ytimg.com/vi/sKKhuOXwAAk/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-03-31 00:00:00	2025-01-08 10:55:08.447
cm5mv1fwy0071djyk4cb7i8tb	Skillshare: Creating Expert Level Shadows	{\n  "title": "",\n  "description": "<p>When you've finished the course - Tick off you name below</p><p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p>",\n  "credentials": {}\n}	https://www.skillshare.com/classes/Photoshop-Like-a-Professional-Creating-Expert-Level-Shadows/1563565830	{}	LINK	https://www.adobe.com/content/dam/cc/us/en/creativecloud/ps_cc_app_RGB.svg	cm5mv1fw1004hdjykh8ifk8x9	2021-02-25 00:00:00	2025-01-08 10:55:08.557
cm5mv1fxb008ddjyk5r2d67qk	Cutout Hair on a black background	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p>",\n  "credentials": {}\n}	https://youtu.be/G030sJcK9oA	{}	LINK	https://i.ytimg.com/vi/G030sJcK9oA/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-04-09 00:00:00	2025-01-08 10:55:08.559
cm5mv1fxi008zdjyk95ml4a7b	How to Place Anything in Perspective in Photoshop	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p>",\n  "credentials": {}\n}	https://www.youtube.com/watch?v=7MM2_oVDi_o	{}	LINK	https://i.ytimg.com/vi/7MM2_oVDi_o/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-06-09 00:00:00	2025-01-08 10:55:08.561
cm5mv1fxo009jdjyk2xp565vl	How to stylish highlights in Photoshop CC	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p>",\n  "credentials": {}\n}	https://www.youtube.com/watch?v=Y-RXsQLvFNQ	{}	LINK	https://i.ytimg.com/vi/Y-RXsQLvFNQ/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-04-15 00:00:00	2025-01-08 10:55:08.563
cm5mv1fxu00a3djykheu969h1	Create Flawless & Seamless Backdrops with Photoshop	{\n  "title": "",\n  "description": "<p>Create Flawless & Seamless Backdrops with Photoshop\\n<a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p>",\n  "credentials": {}\n}	https://www.youtube.com/watch?v=336M9VM5eiI&t=292s	{}	LINK	https://i.ytimg.com/vi/336M9VM5eiI/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-03-04 00:00:00	2025-01-08 10:55:08.566
cm5mv1fy100apdjykkoy5vp4c	Remove Halos from Cutout images	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p>",\n  "credentials": {}\n}	https://www.youtube.com/watch?v=LNAUh3MfVBs	{}	LINK	https://i.ytimg.com/vi/LNAUh3MfVBs/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-05-15 00:00:00	2025-01-08 10:55:08.568
cm5mv1fy800bbdjykhnwt95sw	How To Draw Perspective Shadow - Drawing Shadows In Perspective	{\n  "title": "",\n  "description": "<p><a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p>",\n  "credentials": {}\n}	https://www.youtube.com/watch?v=8XLgmiExAbw	{}	LINK	https://i.ytimg.com/vi/8XLgmiExAbw/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-06-16 00:00:00	2025-01-08 10:55:08.571
cm5mv1fyk00cddjykownrea7a	Video: How to Cut Out Backgrounds and KEEP The Original Shadows	{\n  "title": "",\n  "description": "<p>Photoshop: How to Cut Out Backgrounds and KEEP The Original Shadows\\n<a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p>",\n  "credentials": {}\n}	https://www.youtube.com/watch?v=Q4YVE1NPEfg	{}	LINK	https://i.ytimg.com/vi/Q4YVE1NPEfg/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-03-03 00:00:00	2025-01-08 10:55:08.573
cm5mv1fyd00brdjykvw39f6i7	Video: How to create stylish highlights	{\n  "title": "",\n  "description": "<p>How to create stylish highlights in Photoshop CC 2020!\\n<a href=\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\"></a></p>",\n  "credentials": {}\n}	https://www.youtube.com/watch?v=yUPIChL7_x8	{}	LINK	https://i.ytimg.com/vi/yUPIChL7_x8/maxresdefault.jpg	cm5mv1fw1004hdjykh8ifk8x9	2021-03-03 00:00:00	2025-01-08 10:55:08.575
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
cm5nniqaq0000140ag9kwo3th	corin@ols.design	Corin Fogarty	https://lh3.googleusercontent.com/a/ACg8ocJ-b9vysq7JAyc94ZimAPD2ojviacQmCtY9PAfWMEztHP9hO6Hh=s96-c	\N	2025-01-08 08:42:28.898	2025-01-09 10:05:25.749	t	2025-01-09 10:05:25.748
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
cm5mv1fvp003odjyk49pr6qxu	cm5nniqaq0000140ag9kwo3th
cm5mv1fvy004edjykhkqi11b6	cm5nniqaq0000140ag9kwo3th
\.


--
-- Data for Name: _UserFavorites; Type: TABLE DATA; Schema: public; Owner: corinfogarty
--

COPY public."_UserFavorites" ("A", "B") FROM stdin;
cm5mv1fvp003odjyk49pr6qxu	cm5nniqaq0000140ag9kwo3th
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: corinfogarty
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
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

