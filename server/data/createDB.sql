--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

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
-- Name: create_note_on_youtubenote_insert(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_note_on_youtubenote_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO Note (Title, Content, user_id)
    VALUES ('YouTube Note for Video ' || NEW.video_id, 'Automatically created note.', (SELECT user_id FROM Video WHERE video_id = NEW.video_id))
    RETURNING NoteID INTO NEW.NoteID;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.create_note_on_youtubenote_insert() OWNER TO postgres;

--
-- Name: delete_associated_note(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_associated_note() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Lösche die Note, die mit der YouTubeNote verbunden ist
  DELETE FROM Note
  WHERE NoteID = OLD.NoteID;

  -- Gebe 'null' zurück, um den Löschvorgang auf YouTubeNote fortzusetzen
  RETURN OLD;
END;
$$;


ALTER FUNCTION public.delete_associated_note() OWNER TO postgres;

--
-- Name: update_note_on_youtubenote_update(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_note_on_youtubenote_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Aktualisiere Title und Content in der Note-Tabelle basierend auf NoteID
  UPDATE Note
  SET Title = NEW.Title,
      Content = NEW.Content
  WHERE NoteID = NEW.NoteID;

  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_note_on_youtubenote_update() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: note; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.note (
    noteid integer NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.note OWNER TO postgres;

--
-- Name: note_noteid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.note_noteid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.note_noteid_seq OWNER TO postgres;

--
-- Name: note_noteid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.note_noteid_seq OWNED BY public.note.noteid;


--
-- Name: pdfnote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pdfnote (
    pdfnoteid integer NOT NULL,
    documentpath character varying(255) NOT NULL,
    pagenumber integer NOT NULL,
    noteid integer NOT NULL
);


ALTER TABLE public.pdfnote OWNER TO postgres;

--
-- Name: pdfnote_pdfnoteid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pdfnote_pdfnoteid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pdfnote_pdfnoteid_seq OWNER TO postgres;

--
-- Name: pdfnote_pdfnoteid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pdfnote_pdfnoteid_seq OWNED BY public.pdfnote.pdfnoteid;


--
-- Name: powerpointnote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.powerpointnote (
    powerpointnoteid integer NOT NULL,
    slidenumber integer NOT NULL,
    documentpath character varying(255) NOT NULL,
    noteid integer NOT NULL
);


ALTER TABLE public.powerpointnote OWNER TO postgres;

--
-- Name: powerpointnote_powerpointnoteid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.powerpointnote_powerpointnoteid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.powerpointnote_powerpointnoteid_seq OWNER TO postgres;

--
-- Name: powerpointnote_powerpointnoteid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.powerpointnote_powerpointnoteid_seq OWNED BY public.powerpointnote.powerpointnoteid;


--
-- Name: takenotes12; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.takenotes12 (
    c1 text
);


ALTER TABLE public.takenotes12 OWNER TO postgres;

--
-- Name: user_verification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_verification (
    user_id integer NOT NULL,
    verification_token character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    expires_at timestamp without time zone NOT NULL
);


ALTER TABLE public.user_verification OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    first_name character varying(64) NOT NULL,
    last_name character varying(64) NOT NULL,
    email character varying(128) NOT NULL,
    password character varying(255) NOT NULL,
    created_at text NOT NULL,
    updated_at text NOT NULL,
    verified boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: video; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.video (
    video_id integer NOT NULL,
    videourl character varying(500) NOT NULL,
    videolength integer NOT NULL,
    title character varying(255) NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.video OWNER TO postgres;

--
-- Name: video_video_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.video_video_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.video_video_id_seq OWNER TO postgres;

--
-- Name: video_video_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.video_video_id_seq OWNED BY public.video.video_id;


--
-- Name: youtubenote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.youtubenote (
    youtubenoteid integer NOT NULL,
    "timestamp" time without time zone NOT NULL,
    noteid integer NOT NULL,
    video_id integer NOT NULL
);


ALTER TABLE public.youtubenote OWNER TO postgres;

--
-- Name: youtubenote_youtubenoteid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.youtubenote_youtubenoteid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.youtubenote_youtubenoteid_seq OWNER TO postgres;

--
-- Name: youtubenote_youtubenoteid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.youtubenote_youtubenoteid_seq OWNED BY public.youtubenote.youtubenoteid;


--
-- Name: note noteid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.note ALTER COLUMN noteid SET DEFAULT nextval('public.note_noteid_seq'::regclass);


--
-- Name: pdfnote pdfnoteid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pdfnote ALTER COLUMN pdfnoteid SET DEFAULT nextval('public.pdfnote_pdfnoteid_seq'::regclass);


--
-- Name: powerpointnote powerpointnoteid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.powerpointnote ALTER COLUMN powerpointnoteid SET DEFAULT nextval('public.powerpointnote_powerpointnoteid_seq'::regclass);


--
-- Name: video video_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.video ALTER COLUMN video_id SET DEFAULT nextval('public.video_video_id_seq'::regclass);


--
-- Name: youtubenote youtubenoteid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.youtubenote ALTER COLUMN youtubenoteid SET DEFAULT nextval('public.youtubenote_youtubenoteid_seq'::regclass);


--
-- Data for Name: note; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.note (noteid, title, content, user_id) FROM stdin;
2	Test Notiz	Dies ist eine Testnotiz für das Video.	1
3	Notiz 1	Dies ist die erste Notiz.	1
4	Notiz 1	Dies ist die erste Notiz.	1
5	Notiz 1	Dies ist die erste Notiz.	1
6	Notiz 1	Dies ist die erste Notiz.	1
7	Notiz 1	Dies ist die erste Notiz.	1
9	Notiz 1	Dies ist die erste Notiz.	1
10	Notiz 1	Dies ist die erste Notiz.	1
11	Notiz 1	Dies ist die erste Notiz.	1
12	Notiz 1	Dies ist die erste Notiz.	1
13	Notiz 1	Dies ist die erste Notiz.	1
14	Notiz 1	Dies ist die erste Notiz.	1
15	Notiz 1	Dies ist die erste Notiz.	1
16	Notiz 1	Dies ist die erste Notiz.	1
17	Notiz 1	Dies ist die erste Notiz.	1
18	Notiz 1	Dies ist die erste Notiz.	1
20	YouTube Note for Video 10	Automatically created note.	1
22	YouTube Note for Video 10	Automatically created note.	1
23	My Video Title	This is my note content	1
24	YouTube Note for Video 10	Automatically created note.	1
25	My Video Title	This is my note content	1
26	YouTube Note for Video 10	Automatically created note.	1
\.


--
-- Data for Name: pdfnote; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pdfnote (pdfnoteid, documentpath, pagenumber, noteid) FROM stdin;
\.


--
-- Data for Name: powerpointnote; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.powerpointnote (powerpointnoteid, slidenumber, documentpath, noteid) FROM stdin;
\.


--
-- Data for Name: takenotes12; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.takenotes12 (c1) FROM stdin;
--
-- PostgreSQL database dump
--
\N
-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4
\N
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
\N
SET default_tablespace = '';
\N
SET default_table_access_method = heap;
\N
--
-- Name: note; Type: TABLE; Schema: public; Owner: postgres
--
\N
CREATE TABLE public.note (
    noteid integer NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    user_id integer NOT NULL
);
\N
\N
ALTER TABLE public.note OWNER TO postgres;
\N
--
-- Name: note_noteid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
\N
CREATE SEQUENCE public.note_noteid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
\N
\N
ALTER SEQUENCE public.note_noteid_seq OWNER TO postgres;
\N
--
-- Name: note_noteid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
\N
ALTER SEQUENCE public.note_noteid_seq OWNED BY public.note.noteid;
\N
\N
--
-- Name: pdfnote; Type: TABLE; Schema: public; Owner: postgres
--
\N
CREATE TABLE public.pdfnote (
    pdfnoteid integer NOT NULL,
    documentpath character varying(255) NOT NULL,
    pagenumber integer NOT NULL,
    noteid integer NOT NULL
);
\N
\N
ALTER TABLE public.pdfnote OWNER TO postgres;
\N
--
-- Name: pdfnote_pdfnoteid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
\N
CREATE SEQUENCE public.pdfnote_pdfnoteid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
\N
\N
ALTER SEQUENCE public.pdfnote_pdfnoteid_seq OWNER TO postgres;
\N
--
-- Name: pdfnote_pdfnoteid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
\N
ALTER SEQUENCE public.pdfnote_pdfnoteid_seq OWNED BY public.pdfnote.pdfnoteid;
\N
\N
--
-- Name: powerpointnote; Type: TABLE; Schema: public; Owner: postgres
--
\N
CREATE TABLE public.powerpointnote (
    powerpointnoteid integer NOT NULL,
    slidenumber integer NOT NULL,
    documentpath character varying(255) NOT NULL,
    noteid integer NOT NULL
);
\N
\N
ALTER TABLE public.powerpointnote OWNER TO postgres;
\N
--
-- Name: powerpointnote_powerpointnoteid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
\N
CREATE SEQUENCE public.powerpointnote_powerpointnoteid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
\N
\N
ALTER SEQUENCE public.powerpointnote_powerpointnoteid_seq OWNER TO postgres;
\N
--
-- Name: powerpointnote_powerpointnoteid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
\N
ALTER SEQUENCE public.powerpointnote_powerpointnoteid_seq OWNED BY public.powerpointnote.powerpointnoteid;
\N
\N
--
-- Name: user_verification; Type: TABLE; Schema: public; Owner: postgres
--
\N
CREATE TABLE public.user_verification (
    user_id integer NOT NULL,
    verification_token character varying(255) NOT NULL,
    created_at text NOT NULL,
    expires_at text NOT NULL
);
\N
\N
ALTER TABLE public.user_verification OWNER TO postgres;
\N
--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--
\N
CREATE TABLE public.users (
    user_id integer NOT NULL,
    first_name character varying(64) NOT NULL,
    last_name character varying(64) NOT NULL,
    email character varying(128) NOT NULL,
    password character varying(255) NOT NULL,
    created_at text NOT NULL,
    updated_at text NOT NULL,
    verified boolean DEFAULT false NOT NULL
);
\N
\N
ALTER TABLE public.users OWNER TO postgres;
\N
--
-- Name: video; Type: TABLE; Schema: public; Owner: postgres
--
\N
CREATE TABLE public.video (
    video_id integer NOT NULL,
    videourl character varying(500) NOT NULL,
    videolength integer NOT NULL,
    title character varying(255) NOT NULL,
    user_id integer NOT NULL
);
\N
\N
ALTER TABLE public.video OWNER TO postgres;
\N
--
-- Name: video_video_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
\N
CREATE SEQUENCE public.video_video_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
\N
\N
ALTER SEQUENCE public.video_video_id_seq OWNER TO postgres;
\N
--
-- Name: video_video_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
\N
ALTER SEQUENCE public.video_video_id_seq OWNED BY public.video.video_id;
\N
\N
--
-- Name: youtubenote; Type: TABLE; Schema: public; Owner: postgres
--
\N
CREATE TABLE public.youtubenote (
    youtubenoteid integer NOT NULL,
    "timestamp" time without time zone NOT NULL,
    noteid integer NOT NULL,
    video_id integer NOT NULL
);
\N
\N
ALTER TABLE public.youtubenote OWNER TO postgres;
\N
--
-- Name: youtubenote_youtubenoteid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
\N
CREATE SEQUENCE public.youtubenote_youtubenoteid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
\N
\N
ALTER SEQUENCE public.youtubenote_youtubenoteid_seq OWNER TO postgres;
\N
--
-- Name: youtubenote_youtubenoteid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
\N
ALTER SEQUENCE public.youtubenote_youtubenoteid_seq OWNED BY public.youtubenote.youtubenoteid;
\N
\N
--
-- Name: note noteid; Type: DEFAULT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.note ALTER COLUMN noteid SET DEFAULT nextval('public.note_noteid_seq'::regclass);
\N
\N
--
-- Name: pdfnote pdfnoteid; Type: DEFAULT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.pdfnote ALTER COLUMN pdfnoteid SET DEFAULT nextval('public.pdfnote_pdfnoteid_seq'::regclass);
\N
\N
--
-- Name: powerpointnote powerpointnoteid; Type: DEFAULT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.powerpointnote ALTER COLUMN powerpointnoteid SET DEFAULT nextval('public.powerpointnote_powerpointnoteid_seq'::regclass);
\N
\N
--
-- Name: video video_id; Type: DEFAULT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.video ALTER COLUMN video_id SET DEFAULT nextval('public.video_video_id_seq'::regclass);
\N
\N
--
-- Name: youtubenote youtubenoteid; Type: DEFAULT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.youtubenote ALTER COLUMN youtubenoteid SET DEFAULT nextval('public.youtubenote_youtubenoteid_seq'::regclass);
\N
\N
--
-- Data for Name: note; Type: TABLE DATA; Schema: public; Owner: postgres
--
\N
COPY public.note (noteid, title, content, user_id) FROM stdin;
\\.
\N
\N
--
-- Data for Name: pdfnote; Type: TABLE DATA; Schema: public; Owner: postgres
--
\N
COPY public.pdfnote (pdfnoteid, documentpath, pagenumber, noteid) FROM stdin;
\\.
\N
\N
--
-- Data for Name: powerpointnote; Type: TABLE DATA; Schema: public; Owner: postgres
--
\N
COPY public.powerpointnote (powerpointnoteid, slidenumber, documentpath, noteid) FROM stdin;
\\.
\N
\N
--
-- Data for Name: user_verification; Type: TABLE DATA; Schema: public; Owner: postgres
--
\N
COPY public.user_verification (user_id, verification_token, created_at, expires_at) FROM stdin;
\\.
\N
\N
--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--
\N
COPY public.users (user_id, first_name, last_name, email, password, created_at, updated_at, verified) FROM stdin;
\\.
\N
\N
--
-- Data for Name: video; Type: TABLE DATA; Schema: public; Owner: postgres
--
\N
COPY public.video (video_id, videourl, videolength, title, user_id) FROM stdin;
\\.
\N
\N
--
-- Data for Name: youtubenote; Type: TABLE DATA; Schema: public; Owner: postgres
--
\N
COPY public.youtubenote (youtubenoteid, "timestamp", noteid, video_id) FROM stdin;
\\.
\N
\N
--
-- Name: note_noteid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
\N
SELECT pg_catalog.setval('public.note_noteid_seq', 1, false);
\N
\N
--
-- Name: pdfnote_pdfnoteid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
\N
SELECT pg_catalog.setval('public.pdfnote_pdfnoteid_seq', 1, false);
\N
\N
--
-- Name: powerpointnote_powerpointnoteid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
\N
SELECT pg_catalog.setval('public.powerpointnote_powerpointnoteid_seq', 1, false);
\N
\N
--
-- Name: video_video_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
\N
SELECT pg_catalog.setval('public.video_video_id_seq', 1, false);
\N
\N
--
-- Name: youtubenote_youtubenoteid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
\N
SELECT pg_catalog.setval('public.youtubenote_youtubenoteid_seq', 1, false);
\N
\N
--
-- Name: note note_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.note
    ADD CONSTRAINT note_pkey PRIMARY KEY (noteid);
\N
\N
--
-- Name: pdfnote pdfnote_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.pdfnote
    ADD CONSTRAINT pdfnote_pkey PRIMARY KEY (pdfnoteid);
\N
\N
--
-- Name: powerpointnote powerpointnote_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.powerpointnote
    ADD CONSTRAINT powerpointnote_pkey PRIMARY KEY (powerpointnoteid);
\N
\N
--
-- Name: user_verification user_verification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.user_verification
    ADD CONSTRAINT user_verification_pkey PRIMARY KEY (user_id);
\N
\N
--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
\N
\N
--
-- Name: video video_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.video
    ADD CONSTRAINT video_pkey PRIMARY KEY (video_id);
\N
\N
--
-- Name: youtubenote youtubenote_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.youtubenote
    ADD CONSTRAINT youtubenote_pkey PRIMARY KEY (youtubenoteid);
\N
\N
--
-- Name: pdfnote fk_note_pdf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.pdfnote
    ADD CONSTRAINT fk_note_pdf FOREIGN KEY (noteid) REFERENCES public.note(noteid);
\N
\N
--
-- Name: powerpointnote fk_note_powerpoint; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.powerpointnote
    ADD CONSTRAINT fk_note_powerpoint FOREIGN KEY (noteid) REFERENCES public.note(noteid);
\N
\N
--
-- Name: youtubenote fk_note_youtube; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.youtubenote
    ADD CONSTRAINT fk_note_youtube FOREIGN KEY (noteid) REFERENCES public.note(noteid);
\N
\N
--
-- Name: note fk_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.note
    ADD CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES public.users(user_id);
\N
\N
--
-- Name: video fk_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.video
    ADD CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES public.users(user_id);
\N
\N
--
-- Name: youtubenote fk_video_youtube; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.youtubenote
    ADD CONSTRAINT fk_video_youtube FOREIGN KEY (video_id) REFERENCES public.video(video_id);
\N
\N
--
-- Name: user_verification user_verification_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.user_verification
    ADD CONSTRAINT user_verification_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
\N
\N
--
-- PostgreSQL database dump complete
--
\N
\.


--
-- Data for Name: user_verification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_verification (user_id, verification_token, created_at, expires_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, first_name, last_name, email, password, created_at, updated_at, verified) FROM stdin;
1	Efe	efe	efe@htlwienwest.at	123456789	2024-11-19 17:23:13.98319+00	2024-11-19 17:23:13.98319+00	f
\.


--
-- Data for Name: video; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.video (video_id, videourl, videolength, title, user_id) FROM stdin;
1	https://www.youtube.com/watch?v=E3Huy2cdih0	10000	Test 123456	1
2	https://www.youtube.com/watch?v=E3Huy2cdih0	100	Test 123456	1
3	https://www.youtube.com/embed/01itUQ5d198	829	Brevo Tutorial #1 Account, Listen und Formulare	1
4	https://youtube.com/watch?v=testvideo	300	Test Video	1
10	http://example.com/video123	120	My Video Title	1
\.


--
-- Data for Name: youtubenote; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.youtubenote (youtubenoteid, "timestamp", noteid, video_id) FROM stdin;
6	00:01:30	23	10
7	00:01:30	25	10
\.


--
-- Name: note_noteid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.note_noteid_seq', 26, true);


--
-- Name: pdfnote_pdfnoteid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pdfnote_pdfnoteid_seq', 1, false);


--
-- Name: powerpointnote_powerpointnoteid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.powerpointnote_powerpointnoteid_seq', 1, false);


--
-- Name: video_video_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.video_video_id_seq', 11, true);


--
-- Name: youtubenote_youtubenoteid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.youtubenote_youtubenoteid_seq', 7, true);


--
-- Name: note note_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.note
    ADD CONSTRAINT note_pkey PRIMARY KEY (noteid);


--
-- Name: pdfnote pdfnote_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pdfnote
    ADD CONSTRAINT pdfnote_pkey PRIMARY KEY (pdfnoteid);


--
-- Name: powerpointnote powerpointnote_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.powerpointnote
    ADD CONSTRAINT powerpointnote_pkey PRIMARY KEY (powerpointnoteid);


--
-- Name: user_verification user_verification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_verification
    ADD CONSTRAINT user_verification_pkey PRIMARY KEY (user_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: video video_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.video
    ADD CONSTRAINT video_pkey PRIMARY KEY (video_id);


--
-- Name: youtubenote youtubenote_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.youtubenote
    ADD CONSTRAINT youtubenote_pkey PRIMARY KEY (youtubenoteid);


--
-- Name: youtubenote trigger_create_note_on_youtubenote_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_create_note_on_youtubenote_insert AFTER INSERT ON public.youtubenote FOR EACH ROW EXECUTE FUNCTION public.create_note_on_youtubenote_insert();


--
-- Name: youtubenote youtubenote_delete_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER youtubenote_delete_trigger AFTER DELETE ON public.youtubenote FOR EACH ROW EXECUTE FUNCTION public.delete_associated_note();


--
-- Name: youtubenote youtubenote_update_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER youtubenote_update_trigger AFTER UPDATE OF "timestamp" ON public.youtubenote FOR EACH ROW WHEN ((old."timestamp" IS DISTINCT FROM new."timestamp")) EXECUTE FUNCTION public.update_note_on_youtubenote_update();


--
-- Name: pdfnote fk_note_pdf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pdfnote
    ADD CONSTRAINT fk_note_pdf FOREIGN KEY (noteid) REFERENCES public.note(noteid);


--
-- Name: powerpointnote fk_note_powerpoint; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.powerpointnote
    ADD CONSTRAINT fk_note_powerpoint FOREIGN KEY (noteid) REFERENCES public.note(noteid);


--
-- Name: youtubenote fk_note_youtube; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.youtubenote
    ADD CONSTRAINT fk_note_youtube FOREIGN KEY (noteid) REFERENCES public.note(noteid) ON DELETE SET NULL;


--
-- Name: note fk_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.note
    ADD CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: video fk_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.video
    ADD CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: youtubenote fk_video_youtube; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.youtubenote
    ADD CONSTRAINT fk_video_youtube FOREIGN KEY (video_id) REFERENCES public.video(video_id);


--
-- Name: user_verification user_verification_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_verification
    ADD CONSTRAINT user_verification_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- PostgreSQL database dump complete
--

