--
-- PostgreSQL database dump
--

\restrict FNFogthKgd4Uz5IKk9ZzEQgDEWnrJbQcRaE4NLueuOQo83jOuBliEhkMLwhSzmx

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-06-14 21:55:53

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16705)
-- Name: sar_areas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sar_areas (
    id_area integer NOT NULL,
    id_planta integer NOT NULL,
    nombre_area character varying(100) NOT NULL,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    inhabilitado_en timestamp without time zone
);


ALTER TABLE public.sar_areas OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16704)
-- Name: sar_areas_id_area_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sar_areas_id_area_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sar_areas_id_area_seq OWNER TO postgres;

--
-- TOC entry 5178 (class 0 OID 0)
-- Dependencies: 223
-- Name: sar_areas_id_area_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sar_areas_id_area_seq OWNED BY public.sar_areas.id_area;


--
-- TOC entry 234 (class 1259 OID 16841)
-- Name: sar_auditorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sar_auditorias (
    id_auditoria integer NOT NULL,
    tipo_auditoria character varying(20) NOT NULL,
    uuid_auditoria uuid DEFAULT gen_random_uuid(),
    codigo_auditoria character varying(50) NOT NULL,
    id_plantilla integer NOT NULL,
    id_auditor integer NOT NULL,
    id_planta integer,
    id_area integer,
    id_empleado_auditado integer,
    estado character varying(20) DEFAULT 'CREADA'::character varying NOT NULL,
    fecha_inicio timestamp without time zone,
    fecha_fin timestamp without time zone,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone,
    inhabilitado_en timestamp without time zone,
    creado_por integer,
    actualizado_por integer,
    inhabilitado_por integer,
    CONSTRAINT chk_jerarquia_auditoria CHECK (((((tipo_auditoria)::text = 'PLANTA'::text) AND (id_planta IS NOT NULL) AND (id_area IS NULL) AND (id_empleado_auditado IS NULL)) OR (((tipo_auditoria)::text = 'AREA'::text) AND (id_planta IS NOT NULL) AND (id_area IS NOT NULL) AND (id_empleado_auditado IS NULL)) OR (((tipo_auditoria)::text = 'EMPLEADO'::text) AND (id_planta IS NOT NULL) AND (id_area IS NOT NULL) AND (id_empleado_auditado IS NOT NULL)))),
    CONSTRAINT sar_auditorias_estado_check CHECK (((estado)::text = ANY ((ARRAY['CREADA'::character varying, 'EN_PROCESO'::character varying, 'FINALIZADA'::character varying, 'ABORTADA'::character varying])::text[]))),
    CONSTRAINT sar_auditorias_tipo_auditoria_check CHECK (((tipo_auditoria)::text = ANY ((ARRAY['PLANTA'::character varying, 'AREA'::character varying, 'EMPLEADO'::character varying])::text[])))
);


ALTER TABLE public.sar_auditorias OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16840)
-- Name: sar_auditorias_id_auditoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sar_auditorias_id_auditoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sar_auditorias_id_auditoria_seq OWNER TO postgres;

--
-- TOC entry 5179 (class 0 OID 0)
-- Dependencies: 233
-- Name: sar_auditorias_id_auditoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sar_auditorias_id_auditoria_seq OWNED BY public.sar_auditorias.id_auditoria;


--
-- TOC entry 232 (class 1259 OID 16797)
-- Name: sar_empleados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sar_empleados (
    id_empleado integer NOT NULL,
    uuid_empleado uuid DEFAULT gen_random_uuid(),
    id_area integer NOT NULL,
    primer_nombre character varying(50) NOT NULL,
    segundo_nombre character varying(50),
    primer_apellido character varying(50) NOT NULL,
    segundo_apellido character varying(50),
    correo_institucional character varying(100) NOT NULL,
    cargo character varying(100) NOT NULL,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    inhabilitado_en timestamp without time zone,
    creado_por integer,
    inhabilitado_por integer,
    actualizado_en timestamp without time zone,
    actualizado_por integer
);


ALTER TABLE public.sar_empleados OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16796)
-- Name: sar_empleados_id_empleado_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sar_empleados_id_empleado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sar_empleados_id_empleado_seq OWNER TO postgres;

--
-- TOC entry 5180 (class 0 OID 0)
-- Dependencies: 231
-- Name: sar_empleados_id_empleado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sar_empleados_id_empleado_seq OWNED BY public.sar_empleados.id_empleado;


--
-- TOC entry 238 (class 1259 OID 16944)
-- Name: sar_observaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sar_observaciones (
    id_observacion integer NOT NULL,
    id_respuesta integer NOT NULL,
    descripcion_observacion text NOT NULL,
    nivel_criticidad character varying(20),
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone,
    inhabilitado_en timestamp without time zone,
    creado_por integer,
    actualizado_por integer,
    inhabilitado_por integer,
    CONSTRAINT sar_observaciones_nivel_criticidad_check CHECK (((nivel_criticidad)::text = ANY ((ARRAY['BAJA'::character varying, 'MEDIA'::character varying, 'ALTA'::character varying, 'CRITICA'::character varying])::text[])))
);


ALTER TABLE public.sar_observaciones OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16943)
-- Name: sar_observaciones_id_observacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sar_observaciones_id_observacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sar_observaciones_id_observacion_seq OWNER TO postgres;

--
-- TOC entry 5181 (class 0 OID 0)
-- Dependencies: 237
-- Name: sar_observaciones_id_observacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sar_observaciones_id_observacion_seq OWNED BY public.sar_observaciones.id_observacion;


--
-- TOC entry 222 (class 1259 OID 16693)
-- Name: sar_plantas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sar_plantas (
    id_planta integer NOT NULL,
    nombre_planta character varying(100) NOT NULL,
    ubicacion character varying(255),
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    inhabilitado_en timestamp without time zone
);


ALTER TABLE public.sar_plantas OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16692)
-- Name: sar_plantas_id_planta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sar_plantas_id_planta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sar_plantas_id_planta_seq OWNER TO postgres;

--
-- TOC entry 5182 (class 0 OID 0)
-- Dependencies: 221
-- Name: sar_plantas_id_planta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sar_plantas_id_planta_seq OWNED BY public.sar_plantas.id_planta;


--
-- TOC entry 226 (class 1259 OID 16721)
-- Name: sar_plantillas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sar_plantillas (
    id_plantilla integer NOT NULL,
    codigo_plantilla character varying(50) NOT NULL,
    nombre_plantilla character varying(150) NOT NULL,
    version character varying(20) DEFAULT '1.0'::character varying NOT NULL,
    descripcion text,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone,
    inhabilitado_en timestamp without time zone,
    creado_por integer,
    actualizado_por integer,
    inhabilitado_por integer
);


ALTER TABLE public.sar_plantillas OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16720)
-- Name: sar_plantillas_id_plantilla_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sar_plantillas_id_plantilla_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sar_plantillas_id_plantilla_seq OWNER TO postgres;

--
-- TOC entry 5183 (class 0 OID 0)
-- Dependencies: 225
-- Name: sar_plantillas_id_plantilla_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sar_plantillas_id_plantilla_seq OWNED BY public.sar_plantillas.id_plantilla;


--
-- TOC entry 228 (class 1259 OID 16738)
-- Name: sar_preguntas_plantillas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sar_preguntas_plantillas (
    id_pregunta integer NOT NULL,
    id_plantilla integer NOT NULL,
    texto_pregunta text NOT NULL,
    orden integer NOT NULL,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone,
    inhabilitado_en timestamp without time zone,
    creado_por integer,
    actualizado_por integer,
    inhabilitado_por integer
);


ALTER TABLE public.sar_preguntas_plantillas OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16737)
-- Name: sar_preguntas_plantillas_id_pregunta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sar_preguntas_plantillas_id_pregunta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sar_preguntas_plantillas_id_pregunta_seq OWNER TO postgres;

--
-- TOC entry 5184 (class 0 OID 0)
-- Dependencies: 227
-- Name: sar_preguntas_plantillas_id_pregunta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sar_preguntas_plantillas_id_pregunta_seq OWNED BY public.sar_preguntas_plantillas.id_pregunta;


--
-- TOC entry 236 (class 1259 OID 16904)
-- Name: sar_respuestas_auditorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sar_respuestas_auditorias (
    id_respuesta integer NOT NULL,
    id_auditoria integer NOT NULL,
    id_pregunta integer NOT NULL,
    valor_respuesta character varying(2) NOT NULL,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone,
    inhabilitado_en timestamp without time zone,
    creado_por integer,
    actualizado_por integer,
    inhabilitado_por integer,
    CONSTRAINT sar_respuestas_auditorias_valor_respuesta_check CHECK (((valor_respuesta)::text = ANY ((ARRAY['SI'::character varying, 'NO'::character varying, 'NA'::character varying])::text[])))
);


ALTER TABLE public.sar_respuestas_auditorias OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16903)
-- Name: sar_respuestas_auditorias_id_respuesta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sar_respuestas_auditorias_id_respuesta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sar_respuestas_auditorias_id_respuesta_seq OWNER TO postgres;

--
-- TOC entry 5185 (class 0 OID 0)
-- Dependencies: 235
-- Name: sar_respuestas_auditorias_id_respuesta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sar_respuestas_auditorias_id_respuesta_seq OWNED BY public.sar_respuestas_auditorias.id_respuesta;


--
-- TOC entry 220 (class 1259 OID 16681)
-- Name: sar_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sar_roles (
    id_rol integer NOT NULL,
    nombre_rol character varying(50) NOT NULL,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    inhabilitado_en timestamp without time zone
);


ALTER TABLE public.sar_roles OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16680)
-- Name: sar_roles_id_rol_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sar_roles_id_rol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sar_roles_id_rol_seq OWNER TO postgres;

--
-- TOC entry 5186 (class 0 OID 0)
-- Dependencies: 219
-- Name: sar_roles_id_rol_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sar_roles_id_rol_seq OWNED BY public.sar_roles.id_rol;


--
-- TOC entry 230 (class 1259 OID 16759)
-- Name: sar_usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sar_usuarios (
    id_usuario integer NOT NULL,
    uuid_usuario uuid DEFAULT gen_random_uuid(),
    id_rol integer NOT NULL,
    id_empleado integer,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    estado_activo boolean DEFAULT true,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone,
    inhabilitado_en timestamp without time zone,
    creado_por integer,
    actualizado_por integer,
    inhabilitado_por integer
);


ALTER TABLE public.sar_usuarios OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16758)
-- Name: sar_usuarios_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sar_usuarios_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sar_usuarios_id_usuario_seq OWNER TO postgres;

--
-- TOC entry 5187 (class 0 OID 0)
-- Dependencies: 229
-- Name: sar_usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sar_usuarios_id_usuario_seq OWNED BY public.sar_usuarios.id_usuario;


--
-- TOC entry 4905 (class 2604 OID 16708)
-- Name: sar_areas id_area; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_areas ALTER COLUMN id_area SET DEFAULT nextval('public.sar_areas_id_area_seq'::regclass);


--
-- TOC entry 4919 (class 2604 OID 16844)
-- Name: sar_auditorias id_auditoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_auditorias ALTER COLUMN id_auditoria SET DEFAULT nextval('public.sar_auditorias_id_auditoria_seq'::regclass);


--
-- TOC entry 4916 (class 2604 OID 16800)
-- Name: sar_empleados id_empleado; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_empleados ALTER COLUMN id_empleado SET DEFAULT nextval('public.sar_empleados_id_empleado_seq'::regclass);


--
-- TOC entry 4925 (class 2604 OID 16947)
-- Name: sar_observaciones id_observacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_observaciones ALTER COLUMN id_observacion SET DEFAULT nextval('public.sar_observaciones_id_observacion_seq'::regclass);


--
-- TOC entry 4903 (class 2604 OID 16696)
-- Name: sar_plantas id_planta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_plantas ALTER COLUMN id_planta SET DEFAULT nextval('public.sar_plantas_id_planta_seq'::regclass);


--
-- TOC entry 4907 (class 2604 OID 16724)
-- Name: sar_plantillas id_plantilla; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_plantillas ALTER COLUMN id_plantilla SET DEFAULT nextval('public.sar_plantillas_id_plantilla_seq'::regclass);


--
-- TOC entry 4910 (class 2604 OID 16741)
-- Name: sar_preguntas_plantillas id_pregunta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_preguntas_plantillas ALTER COLUMN id_pregunta SET DEFAULT nextval('public.sar_preguntas_plantillas_id_pregunta_seq'::regclass);


--
-- TOC entry 4923 (class 2604 OID 16907)
-- Name: sar_respuestas_auditorias id_respuesta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_respuestas_auditorias ALTER COLUMN id_respuesta SET DEFAULT nextval('public.sar_respuestas_auditorias_id_respuesta_seq'::regclass);


--
-- TOC entry 4901 (class 2604 OID 16684)
-- Name: sar_roles id_rol; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_roles ALTER COLUMN id_rol SET DEFAULT nextval('public.sar_roles_id_rol_seq'::regclass);


--
-- TOC entry 4912 (class 2604 OID 16762)
-- Name: sar_usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.sar_usuarios_id_usuario_seq'::regclass);


--
-- TOC entry 5158 (class 0 OID 16705)
-- Dependencies: 224
-- Data for Name: sar_areas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sar_areas (id_area, id_planta, nombre_area, creado_en, inhabilitado_en) FROM stdin;
1	1	Area de Mecanica	2026-04-12 19:23:49.176053	\N
2	2	Area de Mecanica	2026-04-12 19:23:49.176053	\N
3	1	Area de Sistemas	2026-04-12 19:23:49.176053	\N
4	2	Area de Sistemas	2026-04-12 19:23:49.176053	\N
5	1	Gerencia de Planta	2026-05-08 18:12:09.89218	\N
6	1	Recursos Humanos	2026-05-08 18:12:09.89218	\N
7	1	Ingenieria de Procesos	2026-05-08 18:12:09.89218	\N
8	1	Mantenimiento	2026-05-08 18:12:09.89218	\N
9	1	Soporte IT	2026-05-08 18:12:09.89218	\N
10	1	Auditoria Interna	2026-05-08 18:12:09.89218	\N
11	1	Control de Calidad	2026-05-08 18:12:09.89218	\N
12	1	Produccion - Modulo de Corte	2026-05-08 18:12:09.89218	\N
13	1	Produccion - Modulo de Costura	2026-05-08 18:12:09.89218	\N
14	1	Produccion - Modulo de Tintoreria/Lavanderia	2026-05-08 18:12:09.89218	\N
15	1	Produccion - Modulo de Empaque	2026-05-08 18:12:09.89218	\N
16	1	Bodega de Producto Terminado	2026-05-08 18:12:09.89218	\N
17	1	Bodega de Materia Prima	2026-05-08 18:12:09.89218	\N
18	1	Bodega de Insumos y Avios	2026-05-08 18:12:09.89218	\N
19	2	Gerencia de Planta	2026-05-08 18:12:09.89218	\N
20	2	Recursos Humanos	2026-05-08 18:12:09.89218	\N
21	2	Ingenieria de Procesos	2026-05-08 18:12:09.89218	\N
22	2	Mantenimiento	2026-05-08 18:12:09.89218	\N
23	2	Soporte IT	2026-05-08 18:12:09.89218	\N
24	2	Auditoria Interna	2026-05-08 18:12:09.89218	\N
25	2	Control de Calidad	2026-05-08 18:12:09.89218	\N
26	2	Produccion - Modulo de Corte	2026-05-08 18:12:09.89218	\N
27	2	Produccion - Modulo de Costura	2026-05-08 18:12:09.89218	\N
28	2	Produccion - Modulo de Tintoreria/Lavanderia	2026-05-08 18:12:09.89218	\N
29	2	Produccion - Modulo de Empaque	2026-05-08 18:12:09.89218	\N
30	2	Bodega de Producto Terminado	2026-05-08 18:12:09.89218	\N
31	2	Bodega de Materia Prima	2026-05-08 18:12:09.89218	\N
32	2	Bodega de Insumos y Avios	2026-05-08 18:12:09.89218	\N
\.


--
-- TOC entry 5168 (class 0 OID 16841)
-- Dependencies: 234
-- Data for Name: sar_auditorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sar_auditorias (id_auditoria, tipo_auditoria, uuid_auditoria, codigo_auditoria, id_plantilla, id_auditor, id_planta, id_area, id_empleado_auditado, estado, fecha_inicio, fecha_fin, creado_en, actualizado_en, inhabilitado_en, creado_por, actualizado_por, inhabilitado_por) FROM stdin;
1	PLANTA	52a09cb3-8069-4f06-8b52-02511dca003d	AUD-1779141345067-549	3	10	1	\N	\N	CREADA	\N	\N	2026-05-18 15:55:45.068883	\N	2026-05-19 19:43:18.362041	\N	\N	10
14	EMPLEADO	d779566b-6a9b-4497-a167-60367801bd5a	AUD-1779555762198-392	3	17	2	27	108	FINALIZADA	2026-05-23 11:04:38.474815	2026-05-23 11:06:54.326327	2026-05-23 11:02:42.199446	2026-05-23 11:06:54.326327	\N	10	17	\N
12	EMPLEADO	25653ac6-068f-4d87-8009-b53cb84778f9	AUD-1779549688163-061	6	13	1	17	148	EN_PROCESO	2026-05-23 09:46:25.437389	\N	2026-05-23 09:21:28.164516	\N	2026-05-23 11:23:21.468426	15	\N	15
10	EMPLEADO	10f04d1f-8c67-4cbf-9330-9151a12d3fbb	AUD-1779548958936-919	3	16	2	32	165	EN_PROCESO	2026-05-23 09:44:30.686015	\N	2026-05-23 09:09:18.937475	\N	2026-05-23 11:23:27.667761	15	\N	15
15	AREA	c8a84848-1df0-4ad5-8382-7fdb03c81cb5	AUD-1779557156290-411	3	13	1	17	\N	CREADA	\N	\N	2026-05-23 11:25:56.291199	\N	2026-05-23 11:26:29.852624	15	\N	15
2	PLANTA	bb9a9601-7829-4ec0-ac6b-b49458ab164a	AUD-1779224182280-206	3	13	1	\N	\N	ABORTADA	2026-05-20 13:48:12.847827	2026-05-20 23:17:59.3696	2026-05-19 14:56:22.281571	2026-05-20 23:17:59.3696	\N	10	13	\N
3	EMPLEADO	c5ba3f0e-dfbf-48fb-84d8-8f2c6a963ffb	AUD-1779224341823-444	3	13	1	3	1	ABORTADA	2026-05-21 12:59:09.499571	2026-05-21 12:59:52.554421	2026-05-19 14:59:01.824275	2026-05-21 12:59:52.554421	\N	10	13	\N
4	EMPLEADO	776558be-e368-45b7-9711-0e0a50a06b4c	AUD-1779390125952-285	3	13	1	3	1	FINALIZADA	2026-05-21 13:02:45.740305	2026-05-21 14:16:11.96264	2026-05-21 13:02:05.953137	2026-05-21 14:16:11.96264	\N	13	13	\N
5	EMPLEADO	3b4024a7-e544-4555-ba35-853187d59ddb	AUD-1779395049709-553	3	13	1	3	1	FINALIZADA	2026-05-21 14:25:24.660226	2026-05-21 14:26:53.610394	2026-05-21 14:24:09.71045	2026-05-21 14:26:53.610394	\N	13	13	\N
16	AREA	432fa887-eb6f-42d6-b6b8-f5abb1976010	AUD-1779557332423-675	3	17	1	5	\N	CREADA	\N	\N	2026-05-23 11:28:52.424107	\N	2026-05-23 11:31:32.817535	15	\N	15
6	EMPLEADO	65ab6bdf-0d90-439e-a460-57d8b375c1b5	AUD-1779395275001-551	3	13	1	3	1	FINALIZADA	2026-05-21 14:28:21.793996	2026-05-21 14:29:38.030989	2026-05-21 14:27:55.001423	2026-05-21 14:29:38.030989	\N	13	13	\N
17	PLANTA	e0ed4d24-3b02-4715-9608-aa1da94656bf	AUD-1779595434958-086	10	20	2	\N	\N	CREADA	\N	\N	2026-05-23 22:03:54.959365	\N	\N	27	\N	\N
7	EMPLEADO	67e00273-34fa-4bc4-b559-5bd51bc4e7ec	AUD-1779397113317-575	3	13	1	3	1	FINALIZADA	2026-05-21 15:03:04.638396	2026-05-21 15:06:34.685235	2026-05-21 14:58:33.318406	2026-05-21 15:06:34.685235	\N	13	13	\N
8	EMPLEADO	a8731d44-e1b4-4204-9104-e4741afc77c8	AUD-1779542223346-547	5	13	1	3	1	CREADA	\N	\N	2026-05-23 07:17:03.346645	\N	2026-05-23 07:17:33.6927	13	\N	15
9	EMPLEADO	a9c499ae-ad06-41b2-90a5-a8586ac0a486	AUD-1779542296628-985	5	13	1	3	1	ABORTADA	2026-05-23 07:19:43.043927	2026-05-23 07:23:01.872258	2026-05-23 07:18:16.628594	2026-05-23 07:23:01.872258	\N	13	13	\N
18	AREA	f3eecfb6-abf3-4009-8808-72f97dfae8ea	AUD-1779595510495-198	9	22	1	18	\N	EN_PROCESO	2026-05-23 22:05:19.788919	\N	2026-05-23 22:05:10.495798	\N	\N	27	\N	\N
19	AREA	caf51281-1349-451c-8fdf-f488fe439339	AUD-1779595603196-830	8	22	1	8	\N	CREADA	\N	\N	2026-05-23 22:06:43.197736	\N	\N	27	\N	\N
21	AREA	e19f92c5-1696-43fb-af4a-a3fbd4502b00	AUD-1779595709742-149	6	20	1	16	\N	CREADA	\N	\N	2026-05-23 22:08:29.743867	\N	2026-05-24 10:54:21.250448	27	\N	15
13	AREA	30612c1d-a304-414f-90e7-ff36a600fa95	AUD-1779549734012-712	3	13	1	13	\N	EN_PROCESO	2026-05-23 09:44:20.678402	\N	2026-05-23 09:22:14.013728	\N	2026-05-23 09:46:05.853778	15	\N	10
22	EMPLEADO	91b6dbe9-623a-4074-9650-08bc01ff0d1c	AUD-1779641632654-863	8	23	1	13	106	EN_PROCESO	2026-05-24 10:54:52.385362	\N	2026-05-24 10:53:52.655471	\N	\N	15	\N	\N
11	EMPLEADO	c651cd9b-e1d5-4264-9c8f-653b490ecdfa	AUD-1779549057034-220	6	13	1	13	102	ABORTADA	2026-05-23 09:44:28.25674	2026-05-23 09:51:02.410333	2026-05-23 09:10:57.035239	2026-05-23 09:51:02.410333	\N	15	13	\N
20	EMPLEADO	024069e9-6170-4f77-92f4-b8f62bd8aeaa	AUD-1779595652385-631	7	13	2	29	133	FINALIZADA	2026-05-23 22:07:40.036519	2026-05-24 10:59:23.748289	2026-05-23 22:07:32.386383	2026-05-24 10:59:23.748289	\N	27	13	\N
23	PLANTA	22e9db7a-7bbc-4419-9f1a-6012340ce6fd	AUD-1779642048215-831	11	13	1	\N	\N	ABORTADA	2026-05-24 11:00:56.317867	2026-05-24 11:01:54.354833	2026-05-24 11:00:48.216313	2026-05-24 11:01:54.354833	\N	15	13	\N
\.


--
-- TOC entry 5166 (class 0 OID 16797)
-- Dependencies: 232
-- Data for Name: sar_empleados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sar_empleados (id_empleado, uuid_empleado, id_area, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, correo_institucional, cargo, creado_en, inhabilitado_en, creado_por, inhabilitado_por, actualizado_en, actualizado_por) FROM stdin;
1	46913da2-178d-4742-976c-6f65514b18f7	3	Elmer	Josue	Menéndez	Reinosa	2516602022@mail.utec.edu.sv	Gerente de Sistemas	2026-04-12 19:30:00.119965	\N	1	\N	\N	\N
2	8a370024-0e94-4b21-9a5b-e3dc58e36b9a	1	Carlos	Ernesto	Mendoza	Jimenez	cemJimenez@mail.robles.com	Gerente de Mecanica	2026-05-08 20:59:00.768376	\N	1	\N	\N	\N
3	05d059c0-b6d3-417d-807a-b6b870205f31	1	Laura	Beatriz	Castillo	Orellana	lbcOrellana@mail.robles.com	Coordinador de Mantenimiento	2026-05-08 20:59:00.768376	\N	1	\N	\N	\N
4	8e93acd4-d8e9-4fa9-bc14-cf2a07edf0c4	1	Jorge	Luis	Martinez	Rivas	jlmRivas@mail.robles.com	Tecnico Electromecanico	2026-05-08 20:59:00.768376	\N	1	\N	\N	\N
5	f53e3fb6-d06e-4225-9eba-31b526dc8c60	1	Ana	Gabriela	Lopez	Perez	aglPerez@mail.robles.com	Mecanico Industrial	2026-05-08 20:59:00.768376	\N	1	\N	\N	\N
6	64ba8fec-8f48-43dc-a215-153add4f73cf	1	Kevin	Orlando	Garcia	Ortiz	kogOrtiz@mail.robles.com	Auxiliar de Mantenimiento	2026-05-08 20:59:00.768376	\N	1	\N	\N	\N
7	f315a537-7331-4ebd-bd00-c1cba2b363f2	2	Laura	Andrea	Mendoza	Orellana	lamOrellana@mail.robles.com	Gerente de Mecanica	2026-05-08 20:59:20.210148	\N	1	\N	\N	\N
8	6dd68c5c-2dd2-4f83-bffa-647d4c25e3d8	2	Josue	Andres	Mendez	Reinosa	jamReinosa@mail.robles.com	Coordinador de Mantenimiento	2026-05-08 20:59:20.210148	\N	1	\N	\N	\N
9	1d6e933c-becf-41e2-a470-3b71850ac440	2	Cecil	Marcos	Menendez	Reyes	cmmReyes@mail.robles.com	Tecnico Electromecanico	2026-05-08 20:59:20.210148	\N	1	\N	\N	\N
10	8d64e3b8-2aab-4da8-8e0a-3678c39af403	2	Vanessa	Gabriela	Ortiz	Gomez	vgoGomez@mail.robles.com	Mecanico Industrial	2026-05-08 20:59:20.210148	\N	1	\N	\N	\N
11	6dfb68bb-00df-41b9-9718-d18e081ff2aa	2	Kevin	Alirio	Perez	Mendez	kapMendez@mail.robles.com	Auxiliar de Mantenimiento	2026-05-08 20:59:20.210148	\N	1	\N	\N	\N
12	314a3b53-5cb0-4e98-80da-2ece5b5b0b11	3	Ricardo	Antonio	Perez	Velasquez	rapPerez@mail.robles.com	Jefe de Sistemas	2026-05-08 21:21:15.056699	\N	1	\N	\N	\N
13	44356873-1e60-499e-aace-002459e2bbee	3	Elmer	Giovanni	Rodriguez	Duarte	egrRodriguez@mail.robles.com	Desarrollador Full-Stack	2026-05-08 21:21:15.056699	\N	1	\N	\N	\N
14	b46227ed-3067-4385-af2c-a96fdb5fa5e4	3	Mauricio	Jose	Zelaya	Castro	mjzZelaya@mail.robles.com	Analista de Datos	2026-05-08 21:21:15.056699	\N	1	\N	\N	\N
15	e320c8d6-bd4c-4fdc-a32a-1863c56a6830	3	Elena	Maria	Sosa	Gomez	emsSosa@mail.robles.com	Administrador de Base de Datos	2026-05-08 21:21:15.056699	\N	1	\N	\N	\N
16	bd612554-99b6-4dfe-bae8-4df5876dbc73	3	Roberto	Carlos	Mejia	Luna	rcmMejia@mail.robles.com	Arquitecto de Software	2026-05-08 21:21:15.056699	\N	1	\N	\N	\N
17	e5c37871-0cb2-4038-abf2-9d6d4266ff4d	4	Sofia	Isabel	Quintanilla	Rivas	siqQuintanilla@mail.robles.com	Jefe de Sistemas	2026-05-08 21:21:23.025602	\N	1	\N	\N	\N
18	d12f01b5-9d45-47a2-9385-7384bbf4d7c0	4	Francisco	Javier	Torres	Montes	fjtTorres@mail.robles.com	Desarrollador Full-Stack	2026-05-08 21:21:23.025602	\N	1	\N	\N	\N
19	361ad380-b409-452d-b103-d4c9a9eaf70e	4	Gabriela	Alejandra	Navarro	Suncin	ganNavarro@mail.robles.com	Administrador de Base de Datos	2026-05-08 21:21:23.025602	\N	1	\N	\N	\N
20	5e58da30-61d4-42b5-b8c4-2110813d4366	4	Luis	Alberto	Henriquez	Flores	lahHenriquez@mail.robles.com	Analista de Datos	2026-05-08 21:21:23.025602	\N	1	\N	\N	\N
21	b24688f6-438d-43e4-b24d-a7e5e251d74d	4	Sandra	Patricia	Escobar	Valle	speEscobar@mail.robles.com	Arquitecto de Software	2026-05-08 21:21:23.025602	\N	1	\N	\N	\N
22	ea0f1caf-d611-43c6-80ec-a98fc376a78c	5	Hector	Arturo	Silva	Castro	hasCastro@mail.robles.com	Gerente de Planta	2026-05-08 21:45:20.401818	\N	1	\N	\N	\N
23	885e3948-9f1d-4dbc-bb4e-061aa214516b	5	Valeria	Beatriz	Morales	Pineda	vbmPineda@mail.robles.com	Gerente de Operaciones	2026-05-08 21:45:20.401818	\N	1	\N	\N	\N
24	86cc4339-41c9-4fb6-8a2b-b84237ece94c	5	Andres	Eduardo	Campos	Navarro	aecNavarro@mail.robles.com	Coordinador de Mejora Continua	2026-05-08 21:45:20.401818	\N	1	\N	\N	\N
25	d79b634c-e355-4629-934e-846c82475abb	5	Monica	Alejandra	Rios	Vargas	marVargas@mail.robles.com	Analista de Costos de Produccion	2026-05-08 21:45:20.401818	\N	1	\N	\N	\N
26	3706450f-1faa-44f9-b29c-f6c2c55a8cc4	5	Silvia	Carolina	Mendez	Cruz	scmCruz@mail.robles.com	Asistente de Gerencia	2026-05-08 21:45:20.401818	\N	1	\N	\N	\N
27	15402dbc-b552-474c-b960-967880cc3e91	19	Rodrigo	Alexander	Guzman	Reyes	ragReyes@mail.robles.com	Gerente de Planta	2026-05-08 21:45:30.152376	\N	1	\N	\N	\N
28	4212ee48-eeeb-4581-b899-4c82ad70c990	19	Daniela	Fernanda	Orellana	Mejia	dfoMejia@mail.robles.com	Gerente de Operaciones	2026-05-08 21:45:30.152376	\N	1	\N	\N	\N
29	15e94159-0a0f-42c8-a9b9-8110b8a44930	19	Mario	Ernesto	Zepeda	Aguilar	mezAguilar@mail.robles.com	Coordinador de Mejora Continua	2026-05-08 21:45:30.152376	\N	1	\N	\N	\N
30	0810da5f-8a07-42e0-b4e9-824801e4e414	19	Claudia	Patricia	Escobar	Fuentes	cpeFuentes@mail.robles.com	Analista de Costos de Produccion	2026-05-08 21:45:30.152376	\N	1	\N	\N	\N
31	0deeee14-d6f2-4f12-93f5-3a6ed4c2fbec	19	Karen	Lisseth	Dominguez	Sosa	kldSosa@mail.robles.com	Asistente de Gerencia	2026-05-08 21:45:30.152376	\N	1	\N	\N	\N
32	20ca541f-a5d4-4c1a-bf4d-d9dd67d13cd0	6	Carmen	Elena	Villatoro	Guevara	cevGuevara@mail.robles.com	Jefe de Recursos Humanos	2026-05-08 21:59:30.921784	\N	1	\N	\N	\N
33	b5e5ef06-d767-4601-b381-7d38fe691762	6	Roberto	Carlos	Quintanilla	Ayala	rcqAyala@mail.robles.com	Coordinador de Salud y Seguridad	2026-05-08 21:59:30.921784	\N	1	\N	\N	\N
34	f7173def-c06a-40b8-96bb-d1b79ed7c5c2	6	Patricia	Guadalupe	Flores	Baires	pgfBaires@mail.robles.com	Analista de Reclutamiento	2026-05-08 21:59:30.921784	\N	1	\N	\N	\N
35	00dfe7fc-d081-434e-b08f-43b2f0ba25ff	6	Edgar	Mauricio	Salinas	Rios	emsRios@mail.robles.com	Especialista en Planillas	2026-05-08 21:59:30.921784	\N	1	\N	\N	\N
36	3984ab55-1335-4af9-9360-7164fb4a0abe	6	Marta	Alicia	Portillo	Linares	mapLinares@mail.robles.com	Trabajadora Social de Planta	2026-05-08 21:59:30.921784	\N	1	\N	\N	\N
37	158f86c9-51bc-470a-9c98-73c1204dfe30	20	Rosa	Maria	Serrano	Benitez	rmsBenitez@mail.robles.com	Jefe de Recursos Humanos	2026-05-08 21:59:42.185045	\N	1	\N	\N	\N
38	23981737-f395-43d4-b45b-470ccff60179	20	Julio	Cesar	Paz	Bonilla	jcpBonilla@mail.robles.com	Coordinador de Salud y Seguridad	2026-05-08 21:59:42.185045	\N	1	\N	\N	\N
39	67f1ec3c-e631-45e3-a138-e3f5c580b3bf	20	Blanca	Estela	Chavez	Luna	becLuna@mail.robles.com	Analista de Reclutamiento	2026-05-08 21:59:42.185045	\N	1	\N	\N	\N
40	29e7c950-3bd4-4c1a-bc25-b8349ebe0bfd	20	Luis	Alonso	Herrera	Cerna	lahCerna@mail.robles.com	Especialista en Planillas	2026-05-08 21:59:42.185045	\N	1	\N	\N	\N
41	53f59503-e77d-4770-b634-cfd2872d86a5	20	Diana	Margarita	Guerra	Santos	dmgSantos@mail.robles.com	Trabajadora Social de Planta	2026-05-08 21:59:42.185045	\N	1	\N	\N	\N
42	dcd7c4e5-070d-49ca-bbf2-38c7c1340616	7	Mauricio	Ernesto	Castillo	Ramos	mecRamos@mail.robles.com	Jefe de Ingenieria de Procesos	2026-05-08 22:11:05.441006	\N	1	\N	\N	\N
43	255bacbe-4cb7-4eb4-9e95-16c8f9b242ac	7	Karla	Vanessa	Guzman	Ortiz	kvgOrtiz@mail.robles.com	Ingeniero de Metodos y Tiempos	2026-05-08 22:11:05.441006	\N	1	\N	\N	\N
44	9aba2fbe-1270-44ce-b820-1f42cf8647b4	7	Nelson	Vladimir	Rios	Alvarado	nvrAlvarado@mail.robles.com	Ingeniero de Datos	2026-05-08 22:11:05.441006	\N	1	\N	\N	\N
45	43fca919-20a8-4ba9-a669-8019ec3e3628	7	Fabiola	Lisseth	Mendez	Chavez	flmChavez@mail.robles.com	Especialista en Balanceo de Lineas	2026-05-08 22:11:05.441006	\N	1	\N	\N	\N
46	e978b7ad-0448-449a-b12d-878372949e1d	7	Gerardo	Antonio	Salazar	Cruz	gasCruz@mail.robles.com	Analista de Procesos Industriales	2026-05-08 22:11:05.441006	\N	1	\N	\N	\N
47	fab1ea95-093b-4282-bb1f-79eefd2f90fe	21	Guillermo	Alexander	Pineda	Soto	gapSoto@mail.robles.com	Jefe de Ingenieria de Procesos	2026-05-08 22:11:15.497195	\N	1	\N	\N	\N
48	34a0aae0-08a8-41d5-8cfb-d1a8bd7c79e7	21	Brenda	Carolina	Lemus	Aguilar	bclAguilar@mail.robles.com	Ingeniero de Metodos y Tiempos	2026-05-08 22:11:15.497195	\N	1	\N	\N	\N
49	60a3a1eb-f703-40d9-ac6c-c2e77516b198	21	Oscar	Armando	Fuentes	Zelaya	oafZelaya@mail.robles.com	Ingeniero de Datos	2026-05-08 22:11:15.497195	\N	1	\N	\N	\N
50	c822e16d-4610-4c92-bf21-d9e555bfb002	21	Marcela	Alejandra	Navas	Gomez	manGomez@mail.robles.com	Especialista en Balanceo de Lineas	2026-05-08 22:11:15.497195	\N	1	\N	\N	\N
102	150f0e46-bed2-4279-9d45-b70672b3e1e5	13	Ana	Maria	Guzman	Lopez	amgLopez@mail.robles.com	Supervisor de Linea de Costura	2026-05-09 07:20:43.904326	\N	1	\N	\N	\N
51	2ad49a60-520e-4c93-a7d8-44b690c256dd	21	Victor	Hugo	Perez	Dominguez	vhpDominguez@mail.robles.com	Analista de Procesos Industriales	2026-05-08 22:11:15.497195	\N	1	\N	\N	\N
52	b94057b6-6ce1-4b4e-b9b0-32dd799b58a5	8	David	Eduardo	Lopez	Garcia	delGarcia@mail.robles.com	Supervisor de Mantenimiento Preventivo	2026-05-08 22:24:48.474348	\N	1	\N	\N	\N
53	9d3fd792-0f17-4c39-b98d-dc373171da58	8	Oscar	Rene	Martinez	Sosa	ormSosa@mail.robles.com	Tecnico de Mantenimiento en Piso	2026-05-08 22:24:48.474348	\N	1	\N	\N	\N
54	13bdc433-92a5-492a-8122-4a663a33158f	8	Luis	Fernando	Cruz	Perez	lfcPerez@mail.robles.com	Tecnico de Calderas y Vapor	2026-05-08 22:24:48.474348	\N	1	\N	\N	\N
55	5e69af44-eba4-4537-b443-23e5d6d518b3	8	Miguel	Angel	Torres	Luna	matLuna@mail.robles.com	Especialista en Lubricacion	2026-05-08 22:24:48.474348	\N	1	\N	\N	\N
56	c27e2f72-1813-4e52-afd3-298ffde45fbb	8	Juan	Carlos	Mejia	Flores	jcmFlores@mail.robles.com	Tecnico de Mantenimiento General	2026-05-08 22:24:48.474348	\N	1	\N	\N	\N
57	c7a7cf89-ba45-4006-b3dd-9921891429f9	22	Victor	Manuel	Rivas	Alvarez	vmrAlvarez@mail.robles.com	Supervisor de Mantenimiento Preventivo	2026-05-08 22:24:55.106294	\N	1	\N	\N	\N
58	9bc30358-1a64-4d03-80e5-eb55c7b6d6cc	22	Diego	Alejandro	Gomez	Cruz	dagCruz@mail.robles.com	Tecnico de Mantenimiento en Piso	2026-05-08 22:24:55.106294	\N	1	\N	\N	\N
59	04eacaa2-59a4-481a-9201-38fbd81d005f	22	Rafael	Antonio	Hernandez	Mendez	rahMendez@mail.robles.com	Tecnico de Calderas y Vapor	2026-05-08 22:24:55.106294	\N	1	\N	\N	\N
60	f2d68e56-4cfd-454b-8f27-17caa5bf3a42	22	Jose	Luis	Aguilar	Ramos	jlaRamos@mail.robles.com	Especialista en Lubricacion	2026-05-08 22:24:55.106294	\N	1	\N	\N	\N
61	94f7a4f4-04e5-4d3f-85d6-733f38e19226	22	Mario	Roberto	Navarro	Castro	mrnCastro@mail.robles.com	Tecnico de Mantenimiento General	2026-05-08 22:24:55.106294	\N	1	\N	\N	\N
62	90c928b2-8251-4b9a-916f-cf353ed1021b	9	Hugo	Ernesto	Ayala	Caceres	heaCaceres@mail.robles.com	Jefe de Infraestructura IT	2026-05-08 22:35:53.283287	\N	1	\N	\N	\N
63	2fb9c53b-438c-4719-9615-380bd241e899	9	Denis	Oswaldo	Portillo	Mejia	dopMejia@mail.robles.com	Administrador de Redes	2026-05-08 22:35:53.283287	\N	1	\N	\N	\N
64	99d055c8-403b-4f29-a538-af86335b770f	9	Karina	Lisseth	Perez	Osorio	klpOsorio@mail.robles.com	Especialista en Telecomunicaciones	2026-05-08 22:35:53.283287	\N	1	\N	\N	\N
65	60427660-5c82-43fa-8442-406bfcdfad0e	9	Jonathan	Alexander	Sosa	Lemus	jasLemus@mail.robles.com	Tecnico de Soporte IT	2026-05-08 22:35:53.283287	\N	1	\N	\N	\N
66	2635a316-1a38-4c6e-9adf-a92e320881de	9	Gabriela	Belen	Diaz	Rivas	gbdRivas@mail.robles.com	Administrador de Ciberseguridad	2026-05-08 22:35:53.283287	\N	1	\N	\N	\N
67	974e87a0-628a-43a0-92c1-77b8d9e9a829	23	Ricardo	Jose	Montes	Chavez	rjmChavez@mail.robles.com	Jefe de Infraestructura IT	2026-05-08 22:36:01.378215	\N	1	\N	\N	\N
68	474d75be-037a-400b-a482-f5d51cdcacd6	23	Samuel	Antonio	Guzman	Herrera	sagHerrera@mail.robles.com	Administrador de Redes	2026-05-08 22:36:01.378215	\N	1	\N	\N	\N
69	fbbf89a3-bf5b-44b1-bab1-f42fca5ebc52	23	Erick	Vladimir	Reyes	Paz	evrPaz@mail.robles.com	Especialista en Telecomunicaciones	2026-05-08 22:36:01.378215	\N	1	\N	\N	\N
70	fb2d26ec-aeec-4d0b-85ff-13859cdc0d6f	23	Jessica	Carolina	Zelaya	Cruz	jczCruz@mail.robles.com	Tecnico de Soporte IT	2026-05-08 22:36:01.378215	\N	1	\N	\N	\N
71	f5ee54ef-7e75-4603-99e1-f0b78d7123af	23	Marcos	Ariel	Fuentes	Salinas	mafSalinas@mail.robles.com	Administrador de Ciberseguridad	2026-05-08 22:36:01.378215	\N	1	\N	\N	\N
72	6c673d96-7592-419b-b57c-b653a83e66aa	10	Ana	Cecilia	Martinez	Lopez	acmLopez@mail.robles.com	Jefe de Auditoria Interna	2026-05-08 22:48:45.074685	\N	1	\N	\N	\N
73	7de31493-745b-4b50-90a4-da74becbe511	10	Luis	Gerardo	Ramirez	Cruz	lgrCruz@mail.robles.com	Supervisor de Auditoria	2026-05-08 22:48:45.074685	\N	1	\N	\N	\N
74	926b1d20-b8ad-4e92-9e56-e7e26362f7ba	10	Marta	Julia	Flores	Perez	mjfPerez@mail.robles.com	Auditor de Procesos	2026-05-08 22:48:45.074685	\N	1	\N	\N	\N
75	06b8b2d0-4755-4b89-852f-2d8747dba167	10	Carlos	Eduardo	Soto	Gomez	cesGomez@mail.robles.com	Auditor de Cumplimiento	2026-05-08 22:48:45.074685	\N	1	\N	\N	\N
76	d29d1820-769d-4434-9442-ddaa0bb24550	10	Diana	Lisseth	Alvarez	Rivas	dlaRivas@mail.robles.com	Auditor de Inventarios	2026-05-08 22:48:45.074685	\N	1	\N	\N	\N
78	607bd0cd-0a5e-428b-95e3-d25f300a5fa5	24	Elena	Margarita	Vargas	Sosa	emvSosa@mail.robles.com	Supervisor de Auditoria	2026-05-08 22:48:49.810206	\N	1	\N	\N	\N
79	75c544bb-95be-40a7-9270-990a01c8b61a	24	Jorge	Alberto	Morales	Luna	jamLuna@mail.robles.com	Auditor de Procesos	2026-05-08 22:48:49.810206	\N	1	\N	\N	\N
80	57aa9ad8-ba75-48a5-abd7-ab8faf091c1c	24	Sofia	Carolina	Ortiz	Diaz	scoDiaz@mail.robles.com	Auditor de Cumplimiento	2026-05-08 22:48:49.810206	\N	1	\N	\N	\N
81	c1f905e3-de54-4b37-9876-a9aaaef1ece9	24	Fernando	Jose	Aguilar	Paz	fjaPaz@mail.robles.com	Auditor de Inventarios	2026-05-08 22:48:49.810206	\N	1	\N	\N	\N
82	149928ff-58fb-46fe-bda6-9874bba40c81	11	Julio	Ernesto	Navarro	Salinas	jenSalinas@mail.robles.com	Jefe de Control de Calidad	2026-05-08 22:58:38.706339	\N	1	\N	\N	\N
83	37b86b2a-8e97-4afb-98fc-ce0d6b733eb1	11	Silvia	Lorena	Campos	Mejia	slcMejia@mail.robles.com	Supervisor de Calidad	2026-05-08 22:58:38.706339	\N	1	\N	\N	\N
84	76c5fc69-6cac-45d9-b2c2-f891c76a7dd2	11	Teresa	Guadalupe	Rivera	Guzman	tgrGuzman@mail.robles.com	Inspector de Calidad en Linea	2026-05-08 22:58:38.706339	\N	1	\N	\N	\N
85	255bb40c-4a6c-4b9a-9eec-96578ab282d4	11	Armando	Jose	Pineda	Flores	ajpFlores@mail.robles.com	Inspector de Producto Terminado	2026-05-08 22:58:38.706339	\N	1	\N	\N	\N
86	e0e8272f-fab3-4338-9393-71fd1fd3b9ec	11	Veronica	Beatriz	Zelaya	Cruz	vbzCruz@mail.robles.com	Tecnico de Laboratorio Textil	2026-05-08 22:58:38.706339	\N	1	\N	\N	\N
87	a829b684-bc8b-42f4-975e-86bc0eab4e07	25	Eduardo	Alfonso	Molina	Rivas	eamRivas@mail.robles.com	Jefe de Control de Calidad	2026-05-08 22:58:43.907043	\N	1	\N	\N	\N
88	88de9a1b-304d-4acc-8b09-0f0aaed2f4d3	25	Gabriela	Belen	Serrano	Paz	gbsPaz@mail.robles.com	Supervisor de Calidad	2026-05-08 22:58:43.907043	\N	1	\N	\N	\N
89	92d2867f-d0e9-4c89-96f1-bcaf59e79656	25	Mario	Vladimir	Escobar	Luna	mveLuna@mail.robles.com	Inspector de Calidad en Linea	2026-05-08 22:58:43.907043	\N	1	\N	\N	\N
90	1cdee813-0aa5-41dc-ad3e-3a37ec28272c	25	Laura	Cecilia	Herrera	Cerna	lchCerna@mail.robles.com	Inspector de Producto Terminado	2026-05-08 22:58:43.907043	\N	1	\N	\N	\N
91	11711f14-0be2-40d3-9ad3-924d90921129	25	Jaime	Antonio	Reyes	Diaz	jarDiaz@mail.robles.com	Tecnico de Laboratorio Textil	2026-05-08 22:58:43.907043	\N	1	\N	\N	\N
92	852f42b6-35d9-4f6d-b079-10e81372d953	12	Francisco	Javier	Mejia	Aragon	fjmAragon@mail.robles.com	Supervisor de Modulo de Corte	2026-05-09 06:55:11.480372	\N	1	\N	\N	\N
93	aafdba50-203a-43ce-afbd-d7a3d2f1b1ff	12	Lorena	Elizabeth	Gomez	Rivas	legRivas@mail.robles.com	Trazador de Tela	2026-05-09 06:55:11.480372	\N	1	\N	\N	\N
94	59f9564d-cfad-45e3-b5b3-26bf4ab57ceb	12	Saul	Antonio	Benitez	Osorio	sabOsorio@mail.robles.com	Cortador Industrial	2026-05-09 06:55:11.480372	\N	1	\N	\N	\N
95	c531cdb7-2051-4a4a-9b9d-ad5b23c35a83	12	Jose	Alfredo	Lemus	Suncin	jalLemus@mail.robles.com	Auxiliar de Extendido y Corte	2026-05-09 06:55:11.480372	\N	1	\N	\N	\N
96	983de4cb-e1f8-4c84-9f54-118d91d1b290	12	Tatiana	Maria	Serrano	Vargas	tmsVargas@mail.robles.com	Inspector de Piezas Cortadas	2026-05-09 06:55:11.480372	\N	1	\N	\N	\N
97	a198e9d2-4131-4e89-8c7a-af7ffb3261e8	26	Roberto	Carlos	Quintanilla	Funes	rcqFunes@mail.robles.com	Supervisor de Modulo de Corte	2026-05-09 06:55:15.679631	\N	1	\N	\N	\N
98	fec50291-81ca-4683-ba51-e964f119a8df	26	Beatriz	Adriana	Perez	Molina	bapMolina@mail.robles.com	Trazador de Tela	2026-05-09 06:55:15.679631	\N	1	\N	\N	\N
99	c452aebb-6f9e-4fe6-a193-0a4a29534225	26	Wilson	Alexander	Guzman	Reyes	wagReyes@mail.robles.com	Cortador Industrial	2026-05-09 06:55:15.679631	\N	1	\N	\N	\N
100	d26cd4b3-2075-4043-9c6c-d6abbec2cf55	26	Manuel	Enrique	Flores	Ayala	mefAyala@mail.robles.com	Auxiliar de Extendido y Corte	2026-05-09 06:55:15.679631	\N	1	\N	\N	\N
101	22b5e19e-bb30-44fd-952a-d83750b56cff	26	Andrea	Lisseth	Diaz	Paz	aldPaz@mail.robles.com	Inspector de Piezas Cortadas	2026-05-09 06:55:15.679631	\N	1	\N	\N	\N
103	dc786656-a99b-46b7-81a4-daa8ccfa1f1b	13	Jose	Antonio	Perez	Martinez	japMartinez@mail.robles.com	Operario de Maquina Plana	2026-05-09 07:20:43.904326	\N	1	\N	\N	\N
104	1e8c9fcb-471b-417b-94f0-f9b60304fddf	13	Maria	Teresa	Rodriguez	Hernandez	mtrHernandez@mail.robles.com	Operario de Maquina Especial	2026-05-09 07:20:43.904326	\N	1	\N	\N	\N
105	b4ba01c2-833b-49be-a2d9-173f7d9a3ad5	13	Carlos	Alberto	Flores	Garcia	cafGarcia@mail.robles.com	Alimentador de Linea	2026-05-09 07:20:43.904326	\N	1	\N	\N	\N
106	72ef70b6-bfbd-4288-8f2b-27d30a2e7ff7	13	Marta	Elena	Rivera	Diaz	merDiaz@mail.robles.com	Revisador de Hilos y Costura	2026-05-09 07:20:43.904326	\N	1	\N	\N	\N
107	74eccc32-b91f-41f6-9f07-1162f3b5f1b1	27	Luis	Enrique	Sosa	Cruz	lesCruz@mail.robles.com	Supervisor de Linea de Costura	2026-05-09 07:20:48.639749	\N	1	\N	\N	\N
108	b262d7d5-35b1-423a-ac51-d29be3645f3d	27	Carmen	Alicia	Ortiz	Mendez	caoMendez@mail.robles.com	Operario de Maquina Plana	2026-05-09 07:20:48.639749	\N	1	\N	\N	\N
109	40045ad0-a2ca-4c5e-b708-d5324dd85acd	27	Jorge	Mario	Luna	Paz	jmlPaz@mail.robles.com	Operario de Maquina Especial	2026-05-09 07:20:48.639749	\N	1	\N	\N	\N
110	ecda9626-816e-44a7-a85e-9292240cd280	27	Blanca	Lidia	Ramos	Aguilar	blrAguilar@mail.robles.com	Alimentador de Linea	2026-05-09 07:20:48.639749	\N	1	\N	\N	\N
111	b7fc4dba-8d70-4675-8388-f90d68d3720b	27	Ricardo	Ernesto	Zelaya	Portillo	rezPortillo@mail.robles.com	Revisador de Hilos y Costura	2026-05-09 07:20:48.639749	\N	1	\N	\N	\N
112	58c421f5-9701-49a3-be1e-33ba0cd45ded	14	Oscar	Armando	Perez	Mejia	oapMejia@mail.robles.com	Supervisor de Tintoreria	2026-05-09 07:26:26.664173	\N	1	\N	\N	\N
113	74829bfd-84b0-4522-b862-41497709ceca	14	Hugo	Alexander	Cruz	Lopez	hacLopez@mail.robles.com	Operador de Maquina Teñidora	2026-05-09 07:26:26.664173	\N	1	\N	\N	\N
114	9e888d7a-1f76-4753-8778-bb19be357bd9	14	Miguel	Angel	Rios	Guzman	marGuzman@mail.robles.com	Preparador de Quimicos	2026-05-09 07:26:26.664173	\N	1	\N	\N	\N
115	6b537678-f25b-4816-8a07-44925cf12974	14	Wendy	Carolina	Flores	Alvarez	wcfAlvarez@mail.robles.com	Operario de Secado Industrial	2026-05-09 07:26:26.664173	\N	1	\N	\N	\N
116	2d3fb962-779d-4708-ba59-afb0d56dd976	14	Tomas	Ernesto	Zelaya	Ramos	tezRamos@mail.robles.com	Auxiliar de Procesos Humedos	2026-05-09 07:26:26.664173	\N	1	\N	\N	\N
117	3da1528a-5a81-4680-b1d7-07ea39f99f2e	28	Julio	Cesar	Morales	Paz	jcmPaz@mail.robles.com	Supervisor de Tintoreria	2026-05-09 07:26:37.513299	\N	1	\N	\N	\N
118	1d561506-753e-4673-a887-1e6048029e2a	28	Efrain	Antonio	Sosa	Herrera	easHerrera@mail.robles.com	Operador de Maquina Teñidora	2026-05-09 07:26:37.513299	\N	1	\N	\N	\N
119	531e079c-7017-4d96-b876-98aa4a630e12	28	Rene	Alonso	Castillo	Mendoza	racMendoza@mail.robles.com	Preparador de Quimicos	2026-05-09 07:26:37.513299	\N	1	\N	\N	\N
120	b7dc8ffe-ecbe-476c-bbeb-f70be1551d65	28	Berta	Alicia	Navarro	Serrano	banSerrano@mail.robles.com	Operario de Secado Industrial	2026-05-09 07:26:37.513299	\N	1	\N	\N	\N
121	d1af383e-d67c-484c-8b50-b97a8fdb1702	28	Edgar	Mauricio	Orellana	Fuentes	emoFuentes@mail.robles.com	Auxiliar de Procesos Humedos	2026-05-09 07:26:37.513299	\N	1	\N	\N	\N
122	584618d4-14fa-484a-9b65-d2311cb18dd6	15	Marta	Alicia	Pineda	Guevara	mapPineda@mail.robles.com	Supervisor de Modulo de Empaque	2026-05-09 07:31:45.960512	\N	1	\N	\N	\N
123	17b88dee-b463-4a26-b889-561c4c021b80	15	Sandra	Elizabeth	Gomez	Linares	segLinares@mail.robles.com	Operario de Doblado y Embolsado	2026-05-09 07:31:45.960512	\N	1	\N	\N	\N
124	284277b7-d4f0-4716-b297-1d6ab42a6c3c	15	Jorge	Alberto	Rivas	Castillo	jarCastillo@mail.robles.com	Etiquetador de Producto	2026-05-09 07:31:45.960512	\N	1	\N	\N	\N
125	32a48be3-6347-4222-860f-13f8d63c9050	15	Nelson	Vladimir	Hernandez	Mejia	nvhMejia@mail.robles.com	Encajador y Estibador	2026-05-09 07:31:45.960512	\N	1	\N	\N	\N
126	623e10e7-ef4d-45db-bde7-debb4a57fe6b	15	Claudia	Patricia	Flores	Vargas	cpfVargas@mail.robles.com	Inspector de Empaque	2026-05-09 07:31:45.960512	\N	1	\N	\N	\N
132	1a002e5e-b574-453c-9f0d-25ce338d7722	29	Ricardo	Antonio	Zelaya	Funes	razFunes@mail.robles.com	Supervisor de Modulo de Empaque	2026-05-09 07:32:36.688217	\N	1	\N	\N	\N
133	76a856b2-780a-4a54-9fc8-521dd95714dc	29	Blanca	Lisseth	Aguilar	Paz	blaPaz@mail.robles.com	Operario de Doblado y Embolsado	2026-05-09 07:32:36.688217	\N	1	\N	\N	\N
134	9ed80442-8738-4ea5-8b82-d7b4221cef4e	29	Saul	Ernesto	Sosa	Mendoza	sesMendoza@mail.robles.com	Etiquetador de Producto	2026-05-09 07:32:36.688217	\N	1	\N	\N	\N
135	3c024f76-94cd-47b4-ad72-043ce49ec092	29	Mario	Roberto	Navas	Gomez	mrnGomez@mail.robles.com	Encajador y Estibador	2026-05-09 07:32:36.688217	\N	1	\N	\N	\N
136	6c459d8f-9e15-4fea-81a8-8a8bc116ad91	29	Silvia	Carolina	Ortiz	Diaz	sc0Diaz@mail.robles.com	Inspector de Empaque	2026-05-09 07:32:36.688217	\N	1	\N	\N	\N
137	a28c1e24-39aa-40f3-b92c-b5a7baa531e8	16	Mauricio	Javier	Suncin	Alvarenga	mjsAlvarenga@mail.robles.com	Jefe de Bodega de Producto Terminado	2026-05-09 07:40:33.720345	\N	1	\N	\N	\N
138	84ac638c-a578-4464-b409-e7b6b73f71ff	16	Edwin	Ricardo	Linares	Perez	erlPerez@mail.robles.com	Auxiliar de Despacho y Carga	2026-05-09 07:40:33.720345	\N	1	\N	\N	\N
139	541cfa1f-606a-40f5-8202-84b4cb2ad6e9	16	Nelson	Oswaldo	Guzman	Reyes	nogReyes@mail.robles.com	Operador de Montacargas	2026-05-09 07:40:33.720345	\N	1	\N	\N	\N
140	ea597622-10bd-4879-8e81-06246bfef385	16	Adriana	Lucia	Vargas	Mendoza	alvMendoza@mail.robles.com	Digitador de Inventarios	2026-05-09 07:40:33.720345	\N	1	\N	\N	\N
141	c4b2fd81-95e2-4b6a-ba1e-e330000f589b	16	Marvin	Alexander	Sosa	Cruz	masCruz@mail.robles.com	Encargado de Picking y Packing	2026-05-09 07:40:33.720345	\N	1	\N	\N	\N
142	b620311b-0189-40c9-8fcf-101e8fc9da04	30	Gilberto	Antonio	Rivas	Fuentes	garFuentes@mail.robles.com	Jefe de Bodega de Producto Terminado	2026-05-09 07:40:39.10441	\N	1	\N	\N	\N
143	7f4d6643-65dd-465d-9ece-281ce0ee7e31	30	Cesar	Augusto	Mejia	Flores	camFlores@mail.robles.com	Auxiliar de Despacho y Carga	2026-05-09 07:40:39.10441	\N	1	\N	\N	\N
144	97462003-46b6-4555-9645-2daba3d5e8b3	30	Walter	Enrique	Zelaya	Portillo	wezPortillo@mail.robles.com	Operador de Montacargas	2026-05-09 07:40:39.10441	\N	1	\N	\N	\N
145	672b147d-cd84-4e09-a27b-b7141d985c5d	30	Karla	Margarita	Gomez	Luna	kmgLuna@mail.robles.com	Digitador de Inventarios	2026-05-09 07:40:39.10441	\N	1	\N	\N	\N
146	833d4924-31ff-4fa4-86e5-6d92a60f7c00	30	Douglas	Vladimir	Diaz	Paz	dvdPaz@mail.robles.com	Encargado de Picking y Packing	2026-05-09 07:40:39.10441	\N	1	\N	\N	\N
147	6e16ae21-24c2-4e48-a807-da3683fd8ac9	17	Gustavo	Adolfo	Herrera	Salinas	gahSalinas@mail.robles.com	Jefe de Bodega de Materia Prima	2026-05-09 07:45:03.11219	\N	1	\N	\N	\N
148	cbd7a165-a020-4529-8452-5c321f87ea39	17	Mirna	Lisseth	Orellana	Paz	mloPaz@mail.robles.com	Controlador de Inventarios de Tela	2026-05-09 07:45:03.11219	\N	1	\N	\N	\N
149	bf8f1355-5bda-4d61-8d48-4faa558efeb2	17	Elias	Antonio	Sosa	Mendez	easMendez@mail.robles.com	Inspector de Recepcion de Tela	2026-05-09 07:45:03.11219	\N	1	\N	\N	\N
150	777a4967-e78e-47a2-bcef-7dc456e1cd23	17	Victor	Manuel	Cruz	Aguilar	vmcAguilar@mail.robles.com	Operador de Montacargas de Rollos	2026-05-09 07:45:03.11219	\N	1	\N	\N	\N
151	594ff7cf-4452-401a-8dc6-adc3113e4f71	17	Jonathan	Alexis	Navarro	Gomez	janGomez@mail.robles.com	Auxiliar de Bodega	2026-05-09 07:45:03.11219	\N	1	\N	\N	\N
152	e2aa68d3-62b7-4db8-b0fc-65560a3891b5	31	Ernesto	Vladimir	Perez	Dominguez	evpDominguez@mail.robles.com	Jefe de Bodega de Materia Prima	2026-05-09 07:45:08.231652	\N	1	\N	\N	\N
153	0477c6f0-39e0-4221-8783-1f94fdaf2e27	31	Ruth	Noemi	Zelaya	Castillo	rnzCastillo@mail.robles.com	Controlador de Inventarios de Tela	2026-05-09 07:45:08.231652	\N	1	\N	\N	\N
154	2b88476c-7911-423d-9401-f90e7f9496eb	31	David	Alexander	Rios	Fuentes	darFuentes@mail.robles.com	Inspector de Recepcion de Tela	2026-05-09 07:45:08.231652	\N	1	\N	\N	\N
155	3e6af9f2-eb86-43df-92be-06a84a799be2	31	Marcos	Ariel	Luna	Serrano	malSerrano@mail.robles.com	Operador de Montacargas de Rollos	2026-05-09 07:45:08.231652	\N	1	\N	\N	\N
156	ff1ff0a2-df44-450b-9751-6eaf8488a499	31	Kevin	Eduardo	Morales	Rivas	kemRivas@mail.robles.com	Auxiliar de Bodega	2026-05-09 07:45:08.231652	\N	1	\N	\N	\N
157	5201cc9f-f5e2-4b30-a9c6-b87a365d381e	18	Roberto	Carlos	Martinez	Ayala	rcmAyala@mail.robles.com	Jefe de Bodega de Insumos	2026-05-09 08:45:43.074497	\N	1	\N	\N	\N
158	4d07bc0a-0784-4c14-82da-1439c3dce79c	18	Diana	Carolina	Mendez	Cruz	dcmCruz@mail.robles.com	Encargado de Kitting	2026-05-09 08:45:43.074497	\N	1	\N	\N	\N
159	62d12aed-93f6-4941-890a-b8259f59ac7c	18	Luis	Fernando	Perez	Soto	lfpSoto@mail.robles.com	Controlador de Inventarios	2026-05-09 08:45:43.074497	\N	1	\N	\N	\N
160	77d2c36d-e3f1-4ba8-a448-c347d7b16852	18	Karla	Beatriz	Ramos	Guzman	kbrGuzman@mail.robles.com	Recibidor de Materiales	2026-05-09 08:45:43.074497	\N	1	\N	\N	\N
161	30f7927f-9743-42c5-a35d-a8cfb89e8340	18	Mario	Ernesto	Flores	Aguilar	mefAguilar@mail.robles.com	Auxiliar de Entregas	2026-05-09 08:45:43.074497	\N	1	\N	\N	\N
162	4ebf322a-6141-4df3-a25e-2c7f2dca01ba	32	Fernando	Jose	Alvarado	Rios	fjaRios@mail.robles.com	Jefe de Bodega de Insumos	2026-05-09 08:45:49.097828	\N	1	\N	\N	\N
164	07c8a427-4e10-46a7-bf78-03cea7fe38a5	32	Jose	Antonio	Mejia	Pineda	jamPineda@mail.robles.com	Controlador de Inventarios	2026-05-09 08:45:49.097828	\N	1	\N	\N	\N
165	86752594-c62b-4b63-8432-8ca43c5531f5	32	Teresa	Maria	Castillo	Fuentes	tmcFuentes@mail.robles.com	Recibidor de Materiales	2026-05-09 08:45:49.097828	\N	1	\N	\N	\N
179	af2b61dc-1cc5-461f-a6fb-49e361d21990	13	Juan	Perez	Marcos	Marroquin	juan.marcos1779539998303@robles.com	Operador	2026-05-23 06:39:58.329318	\N	10	\N	\N	\N
180	aaff709e-5b6f-4774-9a1a-bba5eca76a33	13	Juan	Mauricio	Soto	Amaya	juan.soto1779554336651@robles.com	Operador	2026-05-23 10:38:56.676769	\N	15	\N	\N	\N
181	2f24f2c1-a9ae-4b7f-8266-e519a42454be	10	Marcos	Alirio	Mendez	Pena	marcos.mendez1779554436599@robles.com	Auditor	2026-05-23 10:40:36.627954	\N	15	\N	\N	\N
182	756b104b-be54-4ceb-a5fa-605c62e9279a	24	Jose	Esteban	Cruz	Ramirez	jose.cruz1779571443067@robles.com	Auditor de Procesos	2026-05-23 15:24:03.092723	\N	15	\N	\N	\N
183	d337342a-1b3b-4838-a377-5dc1fd6dc0e8	10	Kevin	Eduardo	Chaves	Marrowuin	kevin.chaves1779571498481@robles.com	Auditor de Calidad	2026-05-23 15:24:58.508073	\N	15	\N	\N	\N
184	a7f54bf7-ae1e-4f20-9671-af9855b1ff1c	24	Duvan	Jose	Gomez	Marroquin	duvan.gomez1779571558042@robles.com	Auditor	2026-05-23 15:25:58.068584	\N	15	\N	\N	\N
185	4a75c867-0f8e-4c0b-a621-78af13a31522	29	Esteban	Andres	Sandoval	Martinez	esteban.sandoval1779571609603@robles.com	Operador	2026-05-23 15:26:49.628986	\N	15	\N	\N	\N
186	34b974af-13ec-43b9-a01d-ee9279309bf9	12	Angie	Marcela	Lopez	Sandoval	angie.lopez1779571647737@robles.com	Operador	2026-05-23 15:27:27.763525	\N	15	\N	\N	\N
187	39f79fb6-6b53-4828-915c-b0c5c437bb24	27	Kimberly	Sandra	Chavez	Martinez	kimberly.chavez1779571686371@robles.com	Operador	2026-05-23 15:28:06.398462	\N	15	\N	\N	\N
188	c58c84ba-42e9-40f6-902d-5eb5bd36b540	10	Fernando	Alessandro	Sandoval	Gomes	fernando.sandoval1779571755969@robles.com	Auditor de Procesos	2026-05-23 15:29:15.994934	\N	15	\N	\N	\N
189	ac3f11a4-c1b2-41dd-9c14-56e70ddc5d1c	24	Mario	Oscar	Larin	Iraheta	mario.larin1779571798979@robles.com	Auditor	2026-05-23 15:29:59.003846	2026-05-23 15:32:25.954808	15	\N	\N	\N
77	1171ef0f-54cf-4569-ab75-b6735a310f77	24	Roberto	Antonio	Castillo	Mendez	racMendez@mail.robles.com	Jefe de Auditoria Interna	2026-05-08 22:48:49.810206	2026-05-23 15:42:31.548199	1	\N	\N	\N
190	e99e9660-92ea-4675-93a1-414c4588442f	24	Josue	Alessandro	Lopez	Cruz	josue.lopez1779572605817@robles.com	Jefe de Auditoria Interna	2026-05-23 15:43:25.845743	2026-05-24 10:04:49.127052	15	\N	\N	\N
163	dc7085de-7fb3-4d15-b7ef-0c464ca7cade	32	Melissa	Lisseth	Ortiz	Chavez	mloChavez@mail.robles.com	Encargado de Kitting	2026-05-09 08:45:49.097828	2026-05-24 10:43:10.902526	1	\N	\N	\N
166	e8518adb-1537-4946-be47-0b3eba4c1817	32	Erick	Alexander	Sosa	Zelaya	easZelaya@mail.robles.com	Auxiliar de Entregas	2026-05-09 08:45:49.097828	2026-05-24 10:43:16.499626	1	\N	\N	\N
191	87d8d36f-6e56-4dab-9d7d-d7458801a609	31	Elmer	Josue	Menendez	Renos	elmer.menendez1779640964110@robles.com	Recepcionistas	2026-05-24 10:42:44.161786	2026-05-24 10:46:24.384758	15	\N	\N	\N
\.


--
-- TOC entry 5172 (class 0 OID 16944)
-- Dependencies: 238
-- Data for Name: sar_observaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sar_observaciones (id_observacion, id_respuesta, descripcion_observacion, nivel_criticidad, creado_en, actualizado_en, inhabilitado_en, creado_por, actualizado_por, inhabilitado_por) FROM stdin;
1	2	Tablero eléctrico expuesto y con chispas	CRITICA	2026-05-20 23:17:59.3696	\N	\N	13	\N	\N
2	3	Tablero eléctrico expuesto y con chispas	CRITICA	2026-05-21 12:59:52.554421	\N	\N	13	\N	\N
3	4	Tablero eléctrico un poco oxidado	BAJA	2026-05-21 13:06:53.985031	\N	\N	13	\N	\N
4	5	Tablero eléctrico un poco oxidado	MEDIA	2026-05-21 13:07:17.322132	\N	\N	13	\N	\N
5	6	Tablero eléctrico un poco oxidado	MEDIA	2026-05-21 13:07:39.807136	\N	\N	13	\N	\N
6	7	Tablero eléctrico un poco oxidado	MEDIA	2026-05-21 14:14:22.042937	\N	\N	13	\N	\N
7	8	Tablero eléctrico un poco oxidado	MEDIA	2026-05-21 14:14:26.701577	\N	\N	13	\N	\N
8	9	Tablero eléctrico un poco oxidado	MEDIA	2026-05-21 14:26:21.41967	\N	\N	13	\N	\N
9	10	Tablero eléctrico un poco oxidado	MEDIA	2026-05-21 14:26:27.822326	\N	\N	13	\N	\N
10	11	Tablero eléctrico un poco oxidado	MEDIA	2026-05-21 14:26:32.520293	\N	\N	13	\N	\N
11	12	Tablero eléctrico un poco oxidado	MEDIA	2026-05-21 14:26:37.640352	\N	\N	13	\N	\N
12	13	Tablero eléctrico un poco oxidado	MEDIA	2026-05-21 14:26:43.2234	\N	\N	13	\N	\N
13	14	Tablero eléctrico un poco oxidado	MEDIA	2026-05-21 14:28:48.314115	\N	\N	13	\N	\N
14	15	Tablero eléctrico un poco oxidado	BAJA	2026-05-21 14:29:10.575541	\N	\N	13	\N	\N
15	16	Tablero eléctrico un poco oxidado	BAJA	2026-05-21 14:29:15.697651	\N	\N	13	\N	\N
16	17	Tablero eléctrico un poco oxidado	BAJA	2026-05-21 14:29:22.256695	\N	\N	13	\N	\N
17	18	Tablero eléctrico un poco oxidado	BAJA	2026-05-21 14:29:29.341094	\N	\N	13	\N	\N
18	19	Tablero eléctrico un poco oxidado	BAJA	2026-05-21 15:04:52.727415	\N	\N	13	\N	\N
19	20	Tablero eléctrico un poco oxidado	BAJA	2026-05-21 15:05:10.595805	\N	\N	13	\N	\N
20	21	Tablero eléctrico un poco oxidado	BAJA	2026-05-21 15:05:18.132925	\N	\N	13	\N	\N
21	22	Tablero eléctrico un poco oxidado	BAJA	2026-05-21 15:05:46.44351	\N	\N	13	\N	\N
22	23	Tablero eléctrico un poco oxidado	BAJA	2026-05-21 15:06:29.972504	\N	\N	13	\N	\N
23	24	Tablero eléctrico un poco oxidado	BAJA	2026-05-23 07:22:37.15159	\N	\N	13	\N	\N
24	25	Tablero eléctrico un poco oxidado	CRITICA	2026-05-23 07:23:01.872258	\N	\N	13	\N	\N
25	26	hhfjhgkj	CRITICA	2026-05-23 09:51:02.410333	\N	\N	13	\N	\N
26	29	Ligera suciedad en hora pico.	MEDIA	2026-05-23 11:06:20.455276	\N	\N	17	\N	\N
27	37	No hay EPP	CRITICA	2026-05-24 11:01:54.354833	\N	\N	13	\N	\N
\.


--
-- TOC entry 5156 (class 0 OID 16693)
-- Dependencies: 222
-- Data for Name: sar_plantas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sar_plantas (id_planta, nombre_planta, ubicacion, creado_en, inhabilitado_en) FROM stdin;
1	Planta Robles	Zona Industrial Norte, Block "B"	2026-04-12 19:22:20.35955	\N
2	Planta Herrera	Zona Industrial Norte, Block "C"	2026-04-12 19:22:20.35955	\N
\.


--
-- TOC entry 5160 (class 0 OID 16721)
-- Dependencies: 226
-- Data for Name: sar_plantillas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sar_plantillas (id_plantilla, codigo_plantilla, nombre_plantilla, version, descripcion, creado_en, actualizado_en, inhabilitado_en, creado_por, actualizado_por, inhabilitado_por) FROM stdin;
1	AUD-BOD-01	Auditoría de Bodega y Limpieza	1.0	Revisión mensual de lineamientos de orden y limpieza en la zona de kitting.	2026-05-15 19:44:26.200653	\N	2026-05-17 21:19:52.036926	\N	\N	15
5	AUD-	Lista de verificación de auditoría de procesos de fabricación	1.0	Utilice la Lista de verificación de auditoría del proceso de fabricación para evaluar y optimizar los procesos de fabricación, garantizando el cumplimiento de los estándares de calidad y eficiencia.	2026-05-22 21:03:24.37314	\N	2026-05-23 07:36:18.753984	15	\N	15
6	AUD-EPP-001	Control de EPP	1.0	Plantilla para el control y correcto uso de EPP.	2026-05-23 07:39:29.044928	\N	\N	15	\N	\N
7	AUD-CERT-CAL-OPR	Certificación de Calidad y Operación	1.0	Plantilla orientada a la evaluación directa y certificación de los trabajadores en sus estaciones de trabajo, garantizando el cumplimiento de los estándares de calidad de la empresa.	2026-05-23 21:56:13.941839	\N	\N	27	\N	\N
8	AUD-SEG-SLDOCP	Seguridad y Salud Ocupacional	1.0	Revisión de las condiciones físicas de las instalaciones para prevenir riesgos laborales y garantizar un entorno de trabajo seguro.	2026-05-23 21:58:24.529246	\N	\N	27	\N	\N
9	AUD-AMB-RES	Gestión Ambiental y Residuos	1.0	Control del impacto ambiental, manejo adecuado de desechos industriales y almacenamiento de sustancias químicas.	2026-05-23 22:01:21.674708	\N	\N	27	\N	\N
3	5S-PLANTA-01	Auditoría de Metodología 5S	1.0	Evaluación mensual del cumplimiento de las 5S en el área de producción y bodega.	2026-05-15 21:17:34.056119	\N	2026-05-23 22:01:42.749841	10	\N	27
10	AUD-EVA-ORDLIM	Evaluación de Orden y Limpieza	1.1	Verificación de espacios de trabajo basada en la filosofía japonesa 5S para maximizar la eficiencia y seguridad del entorno operativo.	2026-05-23 22:03:09.392693	\N	\N	27	\N	\N
11	AUD-0001	Seguridad Industrial	1.0	Ejemplo 1	2026-05-24 10:50:29.903949	\N	\N	15	\N	\N
\.


--
-- TOC entry 5162 (class 0 OID 16738)
-- Dependencies: 228
-- Data for Name: sar_preguntas_plantillas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sar_preguntas_plantillas (id_pregunta, id_plantilla, texto_pregunta, orden, creado_en, actualizado_en, inhabilitado_en, creado_por, actualizado_por, inhabilitado_por) FROM stdin;
1	1	¿El área de kitting se encuentra libre de obstáculos?	1	2026-05-15 19:44:26.200653	\N	\N	\N	\N	\N
2	1	¿Los extintores cuentan con la viñeta de revisión mensual firmada?	2	2026-05-15 19:44:26.200653	\N	\N	\N	\N	\N
3	1	¿El personal de bodega porta el equipo de protección adecuado?	3	2026-05-15 19:44:26.200653	\N	\N	\N	\N	\N
4	3	1. Clasificar (Seiri): ¿Se han retirado del área los elementos innecesarios y materiales obsoletos?	1	2026-05-15 21:17:34.056119	\N	\N	10	\N	\N
5	3	2. Ordenar (Seiton): ¿Están las herramientas y equipos debidamente identificados y en su lugar asignado?	2	2026-05-15 21:17:34.056119	\N	\N	10	\N	\N
6	3	3. Limpiar (Seiso): ¿Se encuentran los pasillos y estaciones de trabajo libres de polvo, basura o derrames?	3	2026-05-15 21:17:34.056119	\N	\N	10	\N	\N
7	3	4. Estandarizar (Seiketsu): ¿Están visibles y actualizadas las ayudas visuales y procedimientos del área?	4	2026-05-15 21:17:34.056119	\N	\N	10	\N	\N
8	3	5. Mantener (Shitsuke): ¿Se evidencia que el personal respeta y aplica los lineamientos de orden diariamente?	5	2026-05-15 21:17:34.056119	\N	\N	10	\N	\N
9	5	¿La secuencia de fabricación se ajusta al flujo del proceso?	1	2026-05-22 21:03:24.37314	\N	\N	15	\N	\N
10	5	¿Los parámetros se establecen según el plan de control/instrucciones de trabajo?	2	2026-05-22 21:03:24.37314	\N	\N	15	\N	\N
11	5	¿Se actualizan y verifican los valores de los parámetros necesarios que deben registrarse para cualquier desviación?	3	2026-05-22 21:03:24.37314	\N	\N	15	\N	\N
12	5	¿Los registros de control y monitoreo de procesos indican que el proceso fue controlado dentro del parámetro de proceso especificado?	4	2026-05-22 21:03:24.37314	\N	\N	15	\N	\N
13	5	¿La frecuencia del seguimiento del proceso se realiza según el plan de control/instrucción de trabajo?	5	2026-05-22 21:03:24.37314	\N	\N	15	\N	\N
14	5	¿Se cumplen los requisitos del SPC según lo especificado en el plan de control/instrucción de trabajo? ¿Es el proceso estadísticamente estable?	6	2026-05-22 21:03:24.37314	\N	\N	15	\N	\N
15	5	¿Todas las herramientas y equipos MMD necesarios para los controles de procesos están disponibles en buenas condiciones de funcionamiento?	7	2026-05-22 21:03:24.37314	\N	\N	15	\N	\N
16	5	¿Se designan características especiales mediante símbolos apropiados en toda la documentación y el personal las conoce?	8	2026-05-22 21:03:24.37314	\N	\N	15	\N	\N
17	6	El personal/Modulo, tiene puesto su equipo de EPP completo?	1	2026-05-23 07:39:29.044928	\N	\N	15	\N	\N
18	6	El EPP esta en prefectas condiciones?	2	2026-05-23 07:39:29.044928	\N	\N	15	\N	\N
19	7	¿El empleado lee y verifica la ficha técnica / orden de producción antes de iniciar el procesamiento del lote?	1	2026-05-23 21:56:13.941839	\N	\N	27	\N	\N
20	7	¿El trabajador realiza la inspección de "autocontrol de calidad" en las primeras piezas procesadas según el manual?	2	2026-05-23 21:56:13.941839	\N	\N	27	\N	\N
21	7	¿El operario demuestra conocimiento práctico en la calibración, ajuste de tensiones y enhebrado de su maquinaria asignada?	3	2026-05-23 21:56:13.941839	\N	\N	27	\N	\N
22	7	¿El empleado aplica correctamente el procedimiento para apartar, etiquetar y reportar el "producto no conforme" (defectos, manchas, roturas)?	4	2026-05-23 21:56:13.941839	\N	\N	27	\N	\N
23	7	¿El trabajador mantiene su bitácora o registro de control de producción diaria actualizado y sin tachaduras?	5	2026-05-23 21:56:13.941839	\N	\N	27	\N	\N
24	8	¿Todo el personal del área auditada porta el Equipo de Protección Personal (EPP) obligatorio (mascarillas, tapones auditivos, guantes anticorte, botas o calzado cerrado)?	1	2026-05-23 21:58:24.529246	\N	\N	27	\N	\N
25	8	¿Los extintores de incendio están libres de obstáculos, señalizados en la pared y con la viñeta de inspección mensual vigente?	2	2026-05-23 21:58:24.529246	\N	\N	27	\N	\N
26	8	¿Las guardas de seguridad protectoras (protectores de agujas, cubiertas de poleas/motores) están instaladas en todas las máquinas y funcionan correctamente?	3	2026-05-23 21:58:24.529246	\N	\N	27	\N	\N
27	8	¿Las estaciones de lavado de ojos de emergencia y los botiquines de primeros auxilios están abastecidos y accesibles a menos de 10 metros?	4	2026-05-23 21:58:24.529246	\N	\N	27	\N	\N
28	8	¿Los sistemas de ventilación y extracción de partículas están encendidos y operando a su capacidad nominal?	5	2026-05-23 21:58:24.529246	\N	\N	27	\N	\N
29	9	¿Los residuos sólidos (plásticos, cartón, desechos orgánicos, retazos) están clasificados correctamente en los contenedores con su código de color respectivo?	1	2026-05-23 22:01:21.674708	\N	\N	27	\N	\N
30	9	¿Los productos químicos industriales (suavizantes, tintes, solventes) están almacenados sobre tarimas antiderrame y alejados de los drenajes pluviales?	2	2026-05-23 22:01:21.674708	\N	\N	27	\N	\N
31	9	¿Cada contenedor de producto químico cuenta con su etiqueta legible y su respectiva Hoja de Datos de Seguridad (MSDS) visible en la pared?	3	2026-05-23 22:01:21.674708	\N	\N	27	\N	\N
32	9	¿Se evidencian fugas de aire comprimido, agua o vapor en las tuberías y válvulas de la instalación?	4	2026-05-23 22:01:21.674708	\N	\N	27	\N	\N
33	9	¿El área de almacenamiento de residuos peligrosos (estopas con aceite, envases vacíos de químicos) se encuentra cerrada, bajo techo y con acceso restringido?	5	2026-05-23 22:01:21.674708	\N	\N	27	\N	\N
34	10	¿El área de trabajo está libre de herramientas, retazos, cajas o materiales innecesarios para el turno actual?	1	2026-05-23 22:03:09.392693	\N	\N	27	\N	\N
35	10	¿Las herramientas de trabajo y avíos (hilos, agujas, tijeras) están en sus lugares designados y debidamente rotulados?	2	2026-05-23 22:03:09.392693	\N	\N	27	\N	\N
36	10	¿El piso, las mesas y las maquinarias están libres de polvo, pelusa, derrames de aceite o residuos de producción?	3	2026-05-23 22:03:09.392693	\N	\N	27	\N	\N
37	10	¿Se encuentran visibles y en buen estado las ayudas visuales, rutas de evacuación y delimitaciones de pasillos (líneas amarillas)?	4	2026-05-23 22:03:09.392693	\N	\N	27	\N	\N
38	10	¿El personal respeta los límites de almacenamiento y mantiene los pasillos peatonales completamente despejados de carritos de transporte?	5	2026-05-23 22:03:09.392693	\N	\N	27	\N	\N
39	11	El equipo EPP esta en buen estado	2	2026-05-24 10:50:29.903949	\N	\N	15	\N	\N
\.


--
-- TOC entry 5170 (class 0 OID 16904)
-- Dependencies: 236
-- Data for Name: sar_respuestas_auditorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sar_respuestas_auditorias (id_respuesta, id_auditoria, id_pregunta, valor_respuesta, creado_en, actualizado_en, inhabilitado_en, creado_por, actualizado_por, inhabilitado_por) FROM stdin;
1	2	7	SI	2026-05-20 23:14:58.666914	\N	\N	13	\N	\N
2	2	6	NO	2026-05-20 23:17:59.3696	\N	\N	13	\N	\N
3	3	4	NO	2026-05-21 12:59:52.554421	\N	\N	13	\N	\N
4	4	4	SI	2026-05-21 13:06:53.985031	\N	\N	13	\N	\N
5	4	5	SI	2026-05-21 13:07:17.322132	\N	\N	13	\N	\N
6	4	6	SI	2026-05-21 13:07:39.807136	\N	\N	13	\N	\N
7	4	7	NO	2026-05-21 14:14:22.042937	\N	\N	13	\N	\N
8	4	8	NO	2026-05-21 14:14:26.701577	\N	\N	13	\N	\N
9	5	4	NA	2026-05-21 14:26:21.41967	\N	\N	13	\N	\N
10	5	5	NA	2026-05-21 14:26:27.822326	\N	\N	13	\N	\N
11	5	6	NA	2026-05-21 14:26:32.520293	\N	\N	13	\N	\N
12	5	7	NA	2026-05-21 14:26:37.640352	\N	\N	13	\N	\N
13	5	8	NA	2026-05-21 14:26:43.2234	\N	\N	13	\N	\N
14	6	4	NA	2026-05-21 14:28:48.314115	\N	\N	13	\N	\N
15	6	5	SI	2026-05-21 14:29:10.575541	\N	\N	13	\N	\N
16	6	6	SI	2026-05-21 14:29:15.697651	\N	\N	13	\N	\N
17	6	7	SI	2026-05-21 14:29:22.256695	\N	\N	13	\N	\N
18	6	8	SI	2026-05-21 14:29:29.341094	\N	\N	13	\N	\N
19	7	4	SI	2026-05-21 15:04:52.727415	\N	\N	13	\N	\N
20	7	5	SI	2026-05-21 15:05:10.595805	\N	\N	13	\N	\N
21	7	6	SI	2026-05-21 15:05:18.132925	\N	\N	13	\N	\N
22	7	7	NO	2026-05-21 15:05:46.44351	\N	\N	13	\N	\N
23	7	8	NO	2026-05-21 15:06:29.972504	\N	\N	13	\N	\N
24	9	9	NO	2026-05-23 07:22:37.15159	\N	\N	13	\N	\N
25	9	10	NO	2026-05-23 07:23:01.872258	\N	\N	13	\N	\N
26	11	17	SI	2026-05-23 09:51:02.410333	\N	\N	13	\N	\N
27	14	4	NO	2026-05-23 11:05:40.402296	\N	\N	17	\N	\N
28	14	5	SI	2026-05-23 11:05:53.543709	\N	\N	17	\N	\N
29	14	6	NO	2026-05-23 11:06:20.455276	\N	\N	17	\N	\N
30	14	7	SI	2026-05-23 11:06:30.242721	\N	\N	17	\N	\N
31	14	8	NA	2026-05-23 11:06:46.444225	\N	\N	17	\N	\N
32	20	19	SI	2026-05-24 10:58:09.43756	\N	\N	13	\N	\N
33	20	20	NO	2026-05-24 10:58:33.26172	\N	\N	13	\N	\N
34	20	21	SI	2026-05-24 10:58:39.828282	\N	\N	13	\N	\N
35	20	22	NA	2026-05-24 10:58:45.398415	\N	\N	13	\N	\N
36	20	23	NA	2026-05-24 10:59:12.717733	\N	\N	13	\N	\N
37	23	39	NO	2026-05-24 11:01:54.354833	\N	\N	13	\N	\N
\.


--
-- TOC entry 5154 (class 0 OID 16681)
-- Dependencies: 220
-- Data for Name: sar_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sar_roles (id_rol, nombre_rol, creado_en, inhabilitado_en) FROM stdin;
1	ADMINISTRADOR	2026-04-12 19:21:07.392138	\N
2	AUDITOR	2026-04-12 19:21:07.392138	\N
\.


--
-- TOC entry 5164 (class 0 OID 16759)
-- Dependencies: 230
-- Data for Name: sar_usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sar_usuarios (id_usuario, uuid_usuario, id_rol, id_empleado, username, password_hash, estado_activo, creado_en, actualizado_en, inhabilitado_en, creado_por, actualizado_por, inhabilitado_por) FROM stdin;
22	b78e0a26-7e53-4c6b-a849-e06f106efce8	2	183	kecMARROWUIN_SAS	$2b$10$u9jPaPt9mQOZrBJfYQrwcuqqIW.JXT/sSp8nwHyIvyr5Bv8C9hr3G	t	2026-05-23 15:36:10.928731	\N	\N	15	\N	\N
26	78a3deac-01d6-468c-9ab6-84b78e66abe8	2	77	racMENDEZ_SAS	$2b$10$A9X/7WPjE0VsMxbjpYujZu3KvnIIvxjXkK1hysnSM5iMlGBsX.LP6	f	2026-05-23 15:41:35.367729	\N	2026-05-23 15:42:31.548199	15	\N	\N
27	150fdf89-75b2-45b1-b6d9-038945745b1f	1	190	jalCRUZ	$2b$10$f64Jbm5D8LrKWtYBOQ/lWOwvNSc6lFSYXi6jOE6Pp8/j5spWZg7FC	f	2026-05-23 15:43:59.565311	\N	2026-05-24 10:04:49.127052	15	\N	\N
28	b2e8555b-5935-4651-9b94-75d347612c41	2	191	ejmRenos_SAS	$2b$10$/4On0Rh4kROKReQlHT1K7O6Z2bl5OKYnJgv6asv5tjpZ9WlLf2veW	f	2026-05-24 10:46:02.873823	\N	2026-05-24 10:46:24.384758	15	\N	\N
23	88550037-0dea-45c0-ba46-76bf03247ed5	2	182	jecRAMIREZ_SAS	$2b$10$WYUwQYiCnRLvR3fNyfjay.od3AVKHmwDhSGJe1.JN6mywQzwja5DS	t	2026-05-23 15:38:20.237756	2026-05-24 10:47:20.999597	\N	15	15	\N
15	30be2229-f04c-4643-878b-464ed9e94b62	1	72	acmLopez_SAS	$2b$10$soMpYGvpLEtf/uXDkrUNxuBybMMAz1IHSsCDOkr0pd4ypYnMsWvSO	t	2026-05-09 09:37:33.941754	2026-05-11 14:57:36.492255	\N	10	10	\N
10	ed4064ae-0760-418f-aaad-206c1c8a3d62	1	12	rapVelazquez_SAS	$2b$10$DpYjm2svHuPavm1y0rT35.55G0aD0PYwvEFK/zRgcmsucgRPihBgK	t	2026-05-09 08:55:37.589125	2026-05-11 15:21:20.003595	\N	1	10	\N
13	70952799-3cf3-4f3a-9827-3d9bd7b62685	2	74	mjfPerez_SAS	$2b$10$iCS3UjudoBQkh1D9as2ujeQD69oqt9uT.j8T7mv4QOLhouRsJBtzC	t	2026-05-09 09:11:59.817541	2026-05-11 15:35:29.076033	\N	\N	13	\N
1	e96aa982-1361-487d-864b-285d2912ea83	1	1	admin_SAS	hash_123	t	2026-04-12 19:27:11.431623	\N	2026-05-16 11:00:33.119353	1	\N	10
2	1084f8c9-6fa0-43a3-b937-81233eb31817	1	\N	auditor_seguro	$2b$10$8T0uLch.e/JTUlTYOrm0HuQ8OsSFuM2fl3LUvDj.DDnsaCUM6oq1a	t	2026-04-23 22:39:42.484972	\N	2026-05-16 11:00:33.119353	1	\N	10
4	6f65318e-375b-4a37-8d2f-815200d5d9bb	2	\N	Operario_1	$2b$10$.3kUSoIYqS9/6hYDz9nkZ.J6Km20/gZn4Ir1NcDmT6nBCqdQuYNq6	t	2026-04-29 22:57:31.391047	\N	2026-05-16 11:00:33.119353	1	\N	10
7	81e1e92c-d4e1-4350-ac7e-b1b5c9046257	2	\N	Operario_2	$2b$10$zRCfekNCCi2XAuv6AkbZHOc5Mz4JnQYLWQl6otLv1C2P/xSTlrnOy	t	2026-05-03 16:44:36.746099	\N	2026-05-16 11:00:33.119353	1	\N	10
9	7119cbaf-d625-4548-83af-33634e305f6b	2	\N	Operario_3	$2b$10$GCLArVe9MzSyWN8dqV7cQ.8Gr579QYqS6ly0AMaKOrK7nIzMd6AjW	t	2026-05-03 16:45:43.449722	\N	2026-05-16 11:00:33.119353	1	\N	10
16	f0fed34e-449f-44bd-8486-ef35bb931c51	2	\N	ABC	$2b$10$YXq/OYvL.ATv/4ht0F.I8O6iBF9QqdDa0Dn10JG51HHjHqAKX7MX6	t	2026-05-23 01:24:56.832586	\N	2026-05-23 10:27:09.186488	10	\N	10
17	558506d7-dd93-46ea-94b5-c196f8d8ee6a	2	181	mamPENA_SAS	$2b$10$SOIkClLSl8/zucrGre0zyeobQsJyqVKT.5zAVXcLKUXvFj.nR9hze	t	2026-05-23 10:53:15.908858	\N	\N	15	\N	\N
18	680fd47f-186a-4ffd-8511-d1ecab4041d5	2	189	molIRAHETA_SAS	$2b$10$k2Xlty7kFw7LpmaABpd.2.RLKTaqd77jRqkM6Zjz.n8ZtonMNOMJi	f	2026-05-23 15:31:27.833054	2026-05-23 15:31:35.427742	2026-05-23 15:32:25.954808	15	15	\N
19	4ba161eb-3e27-4cdb-89d2-627ab666912a	2	188	fasGOMES_SAS	$2b$10$zEkFJqdS0eYruMtfuwtb1.qVNurctNVirW27/BkCrHQPnZm04xkWm	f	2026-05-23 15:33:30.282941	2026-05-23 15:33:37.558407	\N	15	15	\N
20	bc28fd37-2407-49c9-b772-803366e5378f	2	184	djgMARROQUIN_SAS	$2b$10$fjLDPsbqwx5zu/qa4rlp8.kAQhJdXLxFK9EVyHGDt7rJuu1l6f6oa	t	2026-05-23 15:34:28.281777	\N	\N	15	\N	\N
\.


--
-- TOC entry 5188 (class 0 OID 0)
-- Dependencies: 223
-- Name: sar_areas_id_area_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sar_areas_id_area_seq', 32, true);


--
-- TOC entry 5189 (class 0 OID 0)
-- Dependencies: 233
-- Name: sar_auditorias_id_auditoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sar_auditorias_id_auditoria_seq', 23, true);


--
-- TOC entry 5190 (class 0 OID 0)
-- Dependencies: 231
-- Name: sar_empleados_id_empleado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sar_empleados_id_empleado_seq', 191, true);


--
-- TOC entry 5191 (class 0 OID 0)
-- Dependencies: 237
-- Name: sar_observaciones_id_observacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sar_observaciones_id_observacion_seq', 27, true);


--
-- TOC entry 5192 (class 0 OID 0)
-- Dependencies: 221
-- Name: sar_plantas_id_planta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sar_plantas_id_planta_seq', 2, true);


--
-- TOC entry 5193 (class 0 OID 0)
-- Dependencies: 225
-- Name: sar_plantillas_id_plantilla_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sar_plantillas_id_plantilla_seq', 11, true);


--
-- TOC entry 5194 (class 0 OID 0)
-- Dependencies: 227
-- Name: sar_preguntas_plantillas_id_pregunta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sar_preguntas_plantillas_id_pregunta_seq', 39, true);


--
-- TOC entry 5195 (class 0 OID 0)
-- Dependencies: 235
-- Name: sar_respuestas_auditorias_id_respuesta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sar_respuestas_auditorias_id_respuesta_seq', 37, true);


--
-- TOC entry 5196 (class 0 OID 0)
-- Dependencies: 219
-- Name: sar_roles_id_rol_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sar_roles_id_rol_seq', 2, true);


--
-- TOC entry 5197 (class 0 OID 0)
-- Dependencies: 229
-- Name: sar_usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sar_usuarios_id_usuario_seq', 28, true);


--
-- TOC entry 4941 (class 2606 OID 16714)
-- Name: sar_areas sar_areas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_areas
    ADD CONSTRAINT sar_areas_pkey PRIMARY KEY (id_area);


--
-- TOC entry 4965 (class 2606 OID 16862)
-- Name: sar_auditorias sar_auditorias_codigo_auditoria_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_auditorias
    ADD CONSTRAINT sar_auditorias_codigo_auditoria_key UNIQUE (codigo_auditoria);


--
-- TOC entry 4967 (class 2606 OID 16858)
-- Name: sar_auditorias sar_auditorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_auditorias
    ADD CONSTRAINT sar_auditorias_pkey PRIMARY KEY (id_auditoria);


--
-- TOC entry 4969 (class 2606 OID 16860)
-- Name: sar_auditorias sar_auditorias_uuid_auditoria_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_auditorias
    ADD CONSTRAINT sar_auditorias_uuid_auditoria_key UNIQUE (uuid_auditoria);


--
-- TOC entry 4959 (class 2606 OID 16814)
-- Name: sar_empleados sar_empleados_correo_institucional_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_empleados
    ADD CONSTRAINT sar_empleados_correo_institucional_key UNIQUE (correo_institucional);


--
-- TOC entry 4961 (class 2606 OID 16810)
-- Name: sar_empleados sar_empleados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_empleados
    ADD CONSTRAINT sar_empleados_pkey PRIMARY KEY (id_empleado);


--
-- TOC entry 4963 (class 2606 OID 16812)
-- Name: sar_empleados sar_empleados_uuid_empleado_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_empleados
    ADD CONSTRAINT sar_empleados_uuid_empleado_key UNIQUE (uuid_empleado);


--
-- TOC entry 4975 (class 2606 OID 16958)
-- Name: sar_observaciones sar_observaciones_id_respuesta_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_observaciones
    ADD CONSTRAINT sar_observaciones_id_respuesta_key UNIQUE (id_respuesta);


--
-- TOC entry 4977 (class 2606 OID 16956)
-- Name: sar_observaciones sar_observaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_observaciones
    ADD CONSTRAINT sar_observaciones_pkey PRIMARY KEY (id_observacion);


--
-- TOC entry 4937 (class 2606 OID 16703)
-- Name: sar_plantas sar_plantas_nombre_planta_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_plantas
    ADD CONSTRAINT sar_plantas_nombre_planta_key UNIQUE (nombre_planta);


--
-- TOC entry 4939 (class 2606 OID 16701)
-- Name: sar_plantas sar_plantas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_plantas
    ADD CONSTRAINT sar_plantas_pkey PRIMARY KEY (id_planta);


--
-- TOC entry 4943 (class 2606 OID 16736)
-- Name: sar_plantillas sar_plantillas_codigo_plantilla_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_plantillas
    ADD CONSTRAINT sar_plantillas_codigo_plantilla_key UNIQUE (codigo_plantilla);


--
-- TOC entry 4945 (class 2606 OID 16734)
-- Name: sar_plantillas sar_plantillas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_plantillas
    ADD CONSTRAINT sar_plantillas_pkey PRIMARY KEY (id_plantilla);


--
-- TOC entry 4947 (class 2606 OID 16752)
-- Name: sar_preguntas_plantillas sar_preguntas_plantillas_id_plantilla_orden_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_preguntas_plantillas
    ADD CONSTRAINT sar_preguntas_plantillas_id_plantilla_orden_key UNIQUE (id_plantilla, orden);


--
-- TOC entry 4949 (class 2606 OID 16750)
-- Name: sar_preguntas_plantillas sar_preguntas_plantillas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_preguntas_plantillas
    ADD CONSTRAINT sar_preguntas_plantillas_pkey PRIMARY KEY (id_pregunta);


--
-- TOC entry 4971 (class 2606 OID 16917)
-- Name: sar_respuestas_auditorias sar_respuestas_auditorias_id_auditoria_id_pregunta_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_respuestas_auditorias
    ADD CONSTRAINT sar_respuestas_auditorias_id_auditoria_id_pregunta_key UNIQUE (id_auditoria, id_pregunta);


--
-- TOC entry 4973 (class 2606 OID 16915)
-- Name: sar_respuestas_auditorias sar_respuestas_auditorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_respuestas_auditorias
    ADD CONSTRAINT sar_respuestas_auditorias_pkey PRIMARY KEY (id_respuesta);


--
-- TOC entry 4933 (class 2606 OID 16691)
-- Name: sar_roles sar_roles_nombre_rol_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_roles
    ADD CONSTRAINT sar_roles_nombre_rol_key UNIQUE (nombre_rol);


--
-- TOC entry 4935 (class 2606 OID 16689)
-- Name: sar_roles sar_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_roles
    ADD CONSTRAINT sar_roles_pkey PRIMARY KEY (id_rol);


--
-- TOC entry 4951 (class 2606 OID 16771)
-- Name: sar_usuarios sar_usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_usuarios
    ADD CONSTRAINT sar_usuarios_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4953 (class 2606 OID 16775)
-- Name: sar_usuarios sar_usuarios_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_usuarios
    ADD CONSTRAINT sar_usuarios_username_key UNIQUE (username);


--
-- TOC entry 4955 (class 2606 OID 16773)
-- Name: sar_usuarios sar_usuarios_uuid_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_usuarios
    ADD CONSTRAINT sar_usuarios_uuid_usuario_key UNIQUE (uuid_usuario);


--
-- TOC entry 4957 (class 2606 OID 16980)
-- Name: sar_usuarios uk_usuario_empleado; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_usuarios
    ADD CONSTRAINT uk_usuario_empleado UNIQUE (id_empleado);


--
-- TOC entry 4980 (class 2606 OID 16786)
-- Name: sar_usuarios fk_usu_actualizado; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_usuarios
    ADD CONSTRAINT fk_usu_actualizado FOREIGN KEY (actualizado_por) REFERENCES public.sar_usuarios(id_usuario);


--
-- TOC entry 4981 (class 2606 OID 16781)
-- Name: sar_usuarios fk_usu_creado; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_usuarios
    ADD CONSTRAINT fk_usu_creado FOREIGN KEY (creado_por) REFERENCES public.sar_usuarios(id_usuario);


--
-- TOC entry 4982 (class 2606 OID 16791)
-- Name: sar_usuarios fk_usu_inhabilitado; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_usuarios
    ADD CONSTRAINT fk_usu_inhabilitado FOREIGN KEY (inhabilitado_por) REFERENCES public.sar_usuarios(id_usuario);


--
-- TOC entry 4983 (class 2606 OID 16835)
-- Name: sar_usuarios fk_usuario_empleado; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_usuarios
    ADD CONSTRAINT fk_usuario_empleado FOREIGN KEY (id_empleado) REFERENCES public.sar_empleados(id_empleado);


--
-- TOC entry 4978 (class 2606 OID 16715)
-- Name: sar_areas sar_areas_id_planta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_areas
    ADD CONSTRAINT sar_areas_id_planta_fkey FOREIGN KEY (id_planta) REFERENCES public.sar_plantas(id_planta);


--
-- TOC entry 4989 (class 2606 OID 16893)
-- Name: sar_auditorias sar_auditorias_actualizado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_auditorias
    ADD CONSTRAINT sar_auditorias_actualizado_por_fkey FOREIGN KEY (actualizado_por) REFERENCES public.sar_usuarios(id_usuario);


--
-- TOC entry 4990 (class 2606 OID 16888)
-- Name: sar_auditorias sar_auditorias_creado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_auditorias
    ADD CONSTRAINT sar_auditorias_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES public.sar_usuarios(id_usuario);


--
-- TOC entry 4991 (class 2606 OID 16878)
-- Name: sar_auditorias sar_auditorias_id_area_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_auditorias
    ADD CONSTRAINT sar_auditorias_id_area_fkey FOREIGN KEY (id_area) REFERENCES public.sar_areas(id_area);


--
-- TOC entry 4992 (class 2606 OID 16868)
-- Name: sar_auditorias sar_auditorias_id_auditor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_auditorias
    ADD CONSTRAINT sar_auditorias_id_auditor_fkey FOREIGN KEY (id_auditor) REFERENCES public.sar_usuarios(id_usuario);


--
-- TOC entry 4993 (class 2606 OID 16883)
-- Name: sar_auditorias sar_auditorias_id_empleado_auditado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_auditorias
    ADD CONSTRAINT sar_auditorias_id_empleado_auditado_fkey FOREIGN KEY (id_empleado_auditado) REFERENCES public.sar_empleados(id_empleado);


--
-- TOC entry 4994 (class 2606 OID 16873)
-- Name: sar_auditorias sar_auditorias_id_planta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_auditorias
    ADD CONSTRAINT sar_auditorias_id_planta_fkey FOREIGN KEY (id_planta) REFERENCES public.sar_plantas(id_planta);


--
-- TOC entry 4995 (class 2606 OID 16863)
-- Name: sar_auditorias sar_auditorias_id_plantilla_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_auditorias
    ADD CONSTRAINT sar_auditorias_id_plantilla_fkey FOREIGN KEY (id_plantilla) REFERENCES public.sar_plantillas(id_plantilla);


--
-- TOC entry 4996 (class 2606 OID 16898)
-- Name: sar_auditorias sar_auditorias_inhabilitado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_auditorias
    ADD CONSTRAINT sar_auditorias_inhabilitado_por_fkey FOREIGN KEY (inhabilitado_por) REFERENCES public.sar_usuarios(id_usuario);


--
-- TOC entry 4985 (class 2606 OID 16830)
-- Name: sar_empleados sar_empleados_actualizado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_empleados
    ADD CONSTRAINT sar_empleados_actualizado_por_fkey FOREIGN KEY (actualizado_por) REFERENCES public.sar_usuarios(id_usuario);


--
-- TOC entry 4986 (class 2606 OID 16820)
-- Name: sar_empleados sar_empleados_creado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_empleados
    ADD CONSTRAINT sar_empleados_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES public.sar_usuarios(id_usuario);


--
-- TOC entry 4987 (class 2606 OID 16815)
-- Name: sar_empleados sar_empleados_id_area_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_empleados
    ADD CONSTRAINT sar_empleados_id_area_fkey FOREIGN KEY (id_area) REFERENCES public.sar_areas(id_area);


--
-- TOC entry 4988 (class 2606 OID 16825)
-- Name: sar_empleados sar_empleados_inhabilitado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_empleados
    ADD CONSTRAINT sar_empleados_inhabilitado_por_fkey FOREIGN KEY (inhabilitado_por) REFERENCES public.sar_usuarios(id_usuario);


--
-- TOC entry 5002 (class 2606 OID 16969)
-- Name: sar_observaciones sar_observaciones_actualizado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_observaciones
    ADD CONSTRAINT sar_observaciones_actualizado_por_fkey FOREIGN KEY (actualizado_por) REFERENCES public.sar_usuarios(id_usuario);


--
-- TOC entry 5003 (class 2606 OID 16964)
-- Name: sar_observaciones sar_observaciones_creado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_observaciones
    ADD CONSTRAINT sar_observaciones_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES public.sar_usuarios(id_usuario);


--
-- TOC entry 5004 (class 2606 OID 16959)
-- Name: sar_observaciones sar_observaciones_id_respuesta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_observaciones
    ADD CONSTRAINT sar_observaciones_id_respuesta_fkey FOREIGN KEY (id_respuesta) REFERENCES public.sar_respuestas_auditorias(id_respuesta);


--
-- TOC entry 5005 (class 2606 OID 16974)
-- Name: sar_observaciones sar_observaciones_inhabilitado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_observaciones
    ADD CONSTRAINT sar_observaciones_inhabilitado_por_fkey FOREIGN KEY (inhabilitado_por) REFERENCES public.sar_usuarios(id_usuario);


--
-- TOC entry 4979 (class 2606 OID 16753)
-- Name: sar_preguntas_plantillas sar_preguntas_plantillas_id_plantilla_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_preguntas_plantillas
    ADD CONSTRAINT sar_preguntas_plantillas_id_plantilla_fkey FOREIGN KEY (id_plantilla) REFERENCES public.sar_plantillas(id_plantilla);


--
-- TOC entry 4997 (class 2606 OID 16933)
-- Name: sar_respuestas_auditorias sar_respuestas_auditorias_actualizado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_respuestas_auditorias
    ADD CONSTRAINT sar_respuestas_auditorias_actualizado_por_fkey FOREIGN KEY (actualizado_por) REFERENCES public.sar_usuarios(id_usuario);


--
-- TOC entry 4998 (class 2606 OID 16928)
-- Name: sar_respuestas_auditorias sar_respuestas_auditorias_creado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_respuestas_auditorias
    ADD CONSTRAINT sar_respuestas_auditorias_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES public.sar_usuarios(id_usuario);


--
-- TOC entry 4999 (class 2606 OID 16918)
-- Name: sar_respuestas_auditorias sar_respuestas_auditorias_id_auditoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_respuestas_auditorias
    ADD CONSTRAINT sar_respuestas_auditorias_id_auditoria_fkey FOREIGN KEY (id_auditoria) REFERENCES public.sar_auditorias(id_auditoria);


--
-- TOC entry 5000 (class 2606 OID 16923)
-- Name: sar_respuestas_auditorias sar_respuestas_auditorias_id_pregunta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_respuestas_auditorias
    ADD CONSTRAINT sar_respuestas_auditorias_id_pregunta_fkey FOREIGN KEY (id_pregunta) REFERENCES public.sar_preguntas_plantillas(id_pregunta);


--
-- TOC entry 5001 (class 2606 OID 16938)
-- Name: sar_respuestas_auditorias sar_respuestas_auditorias_inhabilitado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_respuestas_auditorias
    ADD CONSTRAINT sar_respuestas_auditorias_inhabilitado_por_fkey FOREIGN KEY (inhabilitado_por) REFERENCES public.sar_usuarios(id_usuario);


--
-- TOC entry 4984 (class 2606 OID 16776)
-- Name: sar_usuarios sar_usuarios_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sar_usuarios
    ADD CONSTRAINT sar_usuarios_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.sar_roles(id_rol);


-- Completed on 2026-06-14 21:55:54

--
-- PostgreSQL database dump complete
--

\unrestrict FNFogthKgd4Uz5IKk9ZzEQgDEWnrJbQcRaE4NLueuOQo83jOuBliEhkMLwhSzmx

