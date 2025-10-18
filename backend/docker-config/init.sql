--
-- PostgreSQL database dump
--

-- Dumped from database version 15.14
-- Dumped by pg_dump version 17.2

-- Started on 2025-10-18 10:29:06 -03

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

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4305 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 16385)
-- Name: admin_event_entity; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.admin_event_entity (
    id character varying(36) NOT NULL,
    admin_event_time bigint,
    realm_id character varying(255),
    operation_type character varying(255),
    auth_realm_id character varying(255),
    auth_client_id character varying(255),
    auth_user_id character varying(255),
    ip_address character varying(255),
    resource_path character varying(2550),
    representation text,
    error character varying(255),
    resource_type character varying(64),
    details_json text
);


ALTER TABLE public.admin_event_entity OWNER TO kc_user;

--
-- TOC entry 215 (class 1259 OID 16390)
-- Name: associated_policy; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.associated_policy (
    policy_id character varying(36) NOT NULL,
    associated_policy_id character varying(36) NOT NULL
);


ALTER TABLE public.associated_policy OWNER TO kc_user;

--
-- TOC entry 216 (class 1259 OID 16393)
-- Name: authentication_execution; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.authentication_execution (
    id character varying(36) NOT NULL,
    alias character varying(255),
    authenticator character varying(36),
    realm_id character varying(36),
    flow_id character varying(36),
    requirement integer,
    priority integer,
    authenticator_flow boolean DEFAULT false NOT NULL,
    auth_flow_id character varying(36),
    auth_config character varying(36)
);


ALTER TABLE public.authentication_execution OWNER TO kc_user;

--
-- TOC entry 217 (class 1259 OID 16397)
-- Name: authentication_flow; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.authentication_flow (
    id character varying(36) NOT NULL,
    alias character varying(255),
    description character varying(255),
    realm_id character varying(36),
    provider_id character varying(36) DEFAULT 'basic-flow'::character varying NOT NULL,
    top_level boolean DEFAULT false NOT NULL,
    built_in boolean DEFAULT false NOT NULL
);


ALTER TABLE public.authentication_flow OWNER TO kc_user;

--
-- TOC entry 218 (class 1259 OID 16405)
-- Name: authenticator_config; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.authenticator_config (
    id character varying(36) NOT NULL,
    alias character varying(255),
    realm_id character varying(36)
);


ALTER TABLE public.authenticator_config OWNER TO kc_user;

--
-- TOC entry 219 (class 1259 OID 16408)
-- Name: authenticator_config_entry; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.authenticator_config_entry (
    authenticator_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.authenticator_config_entry OWNER TO kc_user;

--
-- TOC entry 220 (class 1259 OID 16413)
-- Name: broker_link; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.broker_link (
    identity_provider character varying(255) NOT NULL,
    storage_provider_id character varying(255),
    realm_id character varying(36) NOT NULL,
    broker_user_id character varying(255),
    broker_username character varying(255),
    token text,
    user_id character varying(255) NOT NULL
);


ALTER TABLE public.broker_link OWNER TO kc_user;

--
-- TOC entry 221 (class 1259 OID 16418)
-- Name: client; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.client (
    id character varying(36) NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    full_scope_allowed boolean DEFAULT false NOT NULL,
    client_id character varying(255),
    not_before integer,
    public_client boolean DEFAULT false NOT NULL,
    secret character varying(255),
    base_url character varying(255),
    bearer_only boolean DEFAULT false NOT NULL,
    management_url character varying(255),
    surrogate_auth_required boolean DEFAULT false NOT NULL,
    realm_id character varying(36),
    protocol character varying(255),
    node_rereg_timeout integer DEFAULT 0,
    frontchannel_logout boolean DEFAULT false NOT NULL,
    consent_required boolean DEFAULT false NOT NULL,
    name character varying(255),
    service_accounts_enabled boolean DEFAULT false NOT NULL,
    client_authenticator_type character varying(255),
    root_url character varying(255),
    description character varying(255),
    registration_token character varying(255),
    standard_flow_enabled boolean DEFAULT true NOT NULL,
    implicit_flow_enabled boolean DEFAULT false NOT NULL,
    direct_access_grants_enabled boolean DEFAULT false NOT NULL,
    always_display_in_console boolean DEFAULT false NOT NULL
);


ALTER TABLE public.client OWNER TO kc_user;

--
-- TOC entry 222 (class 1259 OID 16436)
-- Name: client_attributes; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.client_attributes (
    client_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value text
);


ALTER TABLE public.client_attributes OWNER TO kc_user;

--
-- TOC entry 223 (class 1259 OID 16441)
-- Name: client_auth_flow_bindings; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.client_auth_flow_bindings (
    client_id character varying(36) NOT NULL,
    flow_id character varying(36),
    binding_name character varying(255) NOT NULL
);


ALTER TABLE public.client_auth_flow_bindings OWNER TO kc_user;

--
-- TOC entry 224 (class 1259 OID 16444)
-- Name: client_initial_access; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.client_initial_access (
    id character varying(36) NOT NULL,
    realm_id character varying(36) NOT NULL,
    "timestamp" integer,
    expiration integer,
    count integer,
    remaining_count integer
);


ALTER TABLE public.client_initial_access OWNER TO kc_user;

--
-- TOC entry 225 (class 1259 OID 16447)
-- Name: client_node_registrations; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.client_node_registrations (
    client_id character varying(36) NOT NULL,
    value integer,
    name character varying(255) NOT NULL
);


ALTER TABLE public.client_node_registrations OWNER TO kc_user;

--
-- TOC entry 226 (class 1259 OID 16450)
-- Name: client_scope; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.client_scope (
    id character varying(36) NOT NULL,
    name character varying(255),
    realm_id character varying(36),
    description character varying(255),
    protocol character varying(255)
);


ALTER TABLE public.client_scope OWNER TO kc_user;

--
-- TOC entry 227 (class 1259 OID 16455)
-- Name: client_scope_attributes; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.client_scope_attributes (
    scope_id character varying(36) NOT NULL,
    value character varying(2048),
    name character varying(255) NOT NULL
);


ALTER TABLE public.client_scope_attributes OWNER TO kc_user;

--
-- TOC entry 228 (class 1259 OID 16460)
-- Name: client_scope_client; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.client_scope_client (
    client_id character varying(255) NOT NULL,
    scope_id character varying(255) NOT NULL,
    default_scope boolean DEFAULT false NOT NULL
);


ALTER TABLE public.client_scope_client OWNER TO kc_user;

--
-- TOC entry 229 (class 1259 OID 16466)
-- Name: client_scope_role_mapping; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.client_scope_role_mapping (
    scope_id character varying(36) NOT NULL,
    role_id character varying(36) NOT NULL
);


ALTER TABLE public.client_scope_role_mapping OWNER TO kc_user;

--
-- TOC entry 230 (class 1259 OID 16469)
-- Name: component; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.component (
    id character varying(36) NOT NULL,
    name character varying(255),
    parent_id character varying(36),
    provider_id character varying(36),
    provider_type character varying(255),
    realm_id character varying(36),
    sub_type character varying(255)
);


ALTER TABLE public.component OWNER TO kc_user;

--
-- TOC entry 231 (class 1259 OID 16474)
-- Name: component_config; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.component_config (
    id character varying(36) NOT NULL,
    component_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value text
);


ALTER TABLE public.component_config OWNER TO kc_user;

--
-- TOC entry 232 (class 1259 OID 16479)
-- Name: composite_role; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.composite_role (
    composite character varying(36) NOT NULL,
    child_role character varying(36) NOT NULL
);


ALTER TABLE public.composite_role OWNER TO kc_user;

--
-- TOC entry 233 (class 1259 OID 16482)
-- Name: credential; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.credential (
    id character varying(36) NOT NULL,
    salt bytea,
    type character varying(255),
    user_id character varying(36),
    created_date bigint,
    user_label character varying(255),
    secret_data text,
    credential_data text,
    priority integer,
    version integer DEFAULT 0
);


ALTER TABLE public.credential OWNER TO kc_user;

--
-- TOC entry 234 (class 1259 OID 16488)
-- Name: databasechangelog; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.databasechangelog (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    filename character varying(255) NOT NULL,
    dateexecuted timestamp without time zone NOT NULL,
    orderexecuted integer NOT NULL,
    exectype character varying(10) NOT NULL,
    md5sum character varying(35),
    description character varying(255),
    comments character varying(255),
    tag character varying(255),
    liquibase character varying(20),
    contexts character varying(255),
    labels character varying(255),
    deployment_id character varying(10)
);


ALTER TABLE public.databasechangelog OWNER TO kc_user;

--
-- TOC entry 235 (class 1259 OID 16493)
-- Name: databasechangeloglock; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.databasechangeloglock (
    id integer NOT NULL,
    locked boolean NOT NULL,
    lockgranted timestamp without time zone,
    lockedby character varying(255)
);


ALTER TABLE public.databasechangeloglock OWNER TO kc_user;

--
-- TOC entry 236 (class 1259 OID 16496)
-- Name: default_client_scope; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.default_client_scope (
    realm_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL,
    default_scope boolean DEFAULT false NOT NULL
);


ALTER TABLE public.default_client_scope OWNER TO kc_user;

--
-- TOC entry 237 (class 1259 OID 16500)
-- Name: event_entity; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.event_entity (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    details_json character varying(2550),
    error character varying(255),
    ip_address character varying(255),
    realm_id character varying(255),
    session_id character varying(255),
    event_time bigint,
    type character varying(255),
    user_id character varying(255),
    details_json_long_value text
);


ALTER TABLE public.event_entity OWNER TO kc_user;

--
-- TOC entry 238 (class 1259 OID 16505)
-- Name: fed_user_attribute; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.fed_user_attribute (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    value character varying(2024),
    long_value_hash bytea,
    long_value_hash_lower_case bytea,
    long_value text
);


ALTER TABLE public.fed_user_attribute OWNER TO kc_user;

--
-- TOC entry 239 (class 1259 OID 16510)
-- Name: fed_user_consent; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.fed_user_consent (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    created_date bigint,
    last_updated_date bigint,
    client_storage_provider character varying(36),
    external_client_id character varying(255)
);


ALTER TABLE public.fed_user_consent OWNER TO kc_user;

--
-- TOC entry 240 (class 1259 OID 16515)
-- Name: fed_user_consent_cl_scope; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.fed_user_consent_cl_scope (
    user_consent_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL
);


ALTER TABLE public.fed_user_consent_cl_scope OWNER TO kc_user;

--
-- TOC entry 241 (class 1259 OID 16518)
-- Name: fed_user_credential; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.fed_user_credential (
    id character varying(36) NOT NULL,
    salt bytea,
    type character varying(255),
    created_date bigint,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    user_label character varying(255),
    secret_data text,
    credential_data text,
    priority integer
);


ALTER TABLE public.fed_user_credential OWNER TO kc_user;

--
-- TOC entry 242 (class 1259 OID 16523)
-- Name: fed_user_group_membership; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.fed_user_group_membership (
    group_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


ALTER TABLE public.fed_user_group_membership OWNER TO kc_user;

--
-- TOC entry 243 (class 1259 OID 16526)
-- Name: fed_user_required_action; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.fed_user_required_action (
    required_action character varying(255) DEFAULT ' '::character varying NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


ALTER TABLE public.fed_user_required_action OWNER TO kc_user;

--
-- TOC entry 244 (class 1259 OID 16532)
-- Name: fed_user_role_mapping; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.fed_user_role_mapping (
    role_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


ALTER TABLE public.fed_user_role_mapping OWNER TO kc_user;

--
-- TOC entry 245 (class 1259 OID 16535)
-- Name: federated_identity; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.federated_identity (
    identity_provider character varying(255) NOT NULL,
    realm_id character varying(36),
    federated_user_id character varying(255),
    federated_username character varying(255),
    token text,
    user_id character varying(36) NOT NULL
);


ALTER TABLE public.federated_identity OWNER TO kc_user;

--
-- TOC entry 246 (class 1259 OID 16540)
-- Name: federated_user; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.federated_user (
    id character varying(255) NOT NULL,
    storage_provider_id character varying(255),
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.federated_user OWNER TO kc_user;

--
-- TOC entry 247 (class 1259 OID 16545)
-- Name: group_attribute; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.group_attribute (
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255),
    group_id character varying(36) NOT NULL
);


ALTER TABLE public.group_attribute OWNER TO kc_user;

--
-- TOC entry 248 (class 1259 OID 16551)
-- Name: group_role_mapping; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.group_role_mapping (
    role_id character varying(36) NOT NULL,
    group_id character varying(36) NOT NULL
);


ALTER TABLE public.group_role_mapping OWNER TO kc_user;

--
-- TOC entry 249 (class 1259 OID 16554)
-- Name: identity_provider; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.identity_provider (
    internal_id character varying(36) NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    provider_alias character varying(255),
    provider_id character varying(255),
    store_token boolean DEFAULT false NOT NULL,
    authenticate_by_default boolean DEFAULT false NOT NULL,
    realm_id character varying(36),
    add_token_role boolean DEFAULT true NOT NULL,
    trust_email boolean DEFAULT false NOT NULL,
    first_broker_login_flow_id character varying(36),
    post_broker_login_flow_id character varying(36),
    provider_display_name character varying(255),
    link_only boolean DEFAULT false NOT NULL,
    organization_id character varying(255),
    hide_on_login boolean DEFAULT false
);


ALTER TABLE public.identity_provider OWNER TO kc_user;

--
-- TOC entry 250 (class 1259 OID 16566)
-- Name: identity_provider_config; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.identity_provider_config (
    identity_provider_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.identity_provider_config OWNER TO kc_user;

--
-- TOC entry 251 (class 1259 OID 16571)
-- Name: identity_provider_mapper; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.identity_provider_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    idp_alias character varying(255) NOT NULL,
    idp_mapper_name character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.identity_provider_mapper OWNER TO kc_user;

--
-- TOC entry 252 (class 1259 OID 16576)
-- Name: idp_mapper_config; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.idp_mapper_config (
    idp_mapper_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.idp_mapper_config OWNER TO kc_user;

--
-- TOC entry 253 (class 1259 OID 16581)
-- Name: jgroups_ping; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.jgroups_ping (
    address character varying(200) NOT NULL,
    name character varying(200),
    cluster_name character varying(200) NOT NULL,
    ip character varying(200) NOT NULL,
    coord boolean
);


ALTER TABLE public.jgroups_ping OWNER TO kc_user;

--
-- TOC entry 254 (class 1259 OID 16586)
-- Name: keycloak_group; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.keycloak_group (
    id character varying(36) NOT NULL,
    name character varying(255),
    parent_group character varying(36) NOT NULL,
    realm_id character varying(36),
    type integer DEFAULT 0 NOT NULL,
    description character varying(255)
);


ALTER TABLE public.keycloak_group OWNER TO kc_user;

--
-- TOC entry 255 (class 1259 OID 16592)
-- Name: keycloak_role; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.keycloak_role (
    id character varying(36) NOT NULL,
    client_realm_constraint character varying(255),
    client_role boolean DEFAULT false NOT NULL,
    description character varying(255),
    name character varying(255),
    realm_id character varying(255),
    client character varying(36),
    realm character varying(36)
);


ALTER TABLE public.keycloak_role OWNER TO kc_user;

--
-- TOC entry 256 (class 1259 OID 16598)
-- Name: migration_model; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.migration_model (
    id character varying(36) NOT NULL,
    version character varying(36),
    update_time bigint DEFAULT 0 NOT NULL
);


ALTER TABLE public.migration_model OWNER TO kc_user;

--
-- TOC entry 257 (class 1259 OID 16602)
-- Name: offline_client_session; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.offline_client_session (
    user_session_id character varying(36) NOT NULL,
    client_id character varying(255) NOT NULL,
    offline_flag character varying(4) NOT NULL,
    "timestamp" integer,
    data text,
    client_storage_provider character varying(36) DEFAULT 'local'::character varying NOT NULL,
    external_client_id character varying(255) DEFAULT 'local'::character varying NOT NULL,
    version integer DEFAULT 0
);


ALTER TABLE public.offline_client_session OWNER TO kc_user;

--
-- TOC entry 258 (class 1259 OID 16610)
-- Name: offline_user_session; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.offline_user_session (
    user_session_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    created_on integer NOT NULL,
    offline_flag character varying(4) NOT NULL,
    data text,
    last_session_refresh integer DEFAULT 0 NOT NULL,
    broker_session_id character varying(1024),
    version integer DEFAULT 0
);


ALTER TABLE public.offline_user_session OWNER TO kc_user;

--
-- TOC entry 259 (class 1259 OID 16617)
-- Name: org; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.org (
    id character varying(255) NOT NULL,
    enabled boolean NOT NULL,
    realm_id character varying(255) NOT NULL,
    group_id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(4000),
    alias character varying(255) NOT NULL,
    redirect_url character varying(2048)
);


ALTER TABLE public.org OWNER TO kc_user;

--
-- TOC entry 260 (class 1259 OID 16622)
-- Name: org_domain; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.org_domain (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    verified boolean NOT NULL,
    org_id character varying(255) NOT NULL
);


ALTER TABLE public.org_domain OWNER TO kc_user;

--
-- TOC entry 261 (class 1259 OID 16627)
-- Name: policy_config; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.policy_config (
    policy_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value text
);


ALTER TABLE public.policy_config OWNER TO kc_user;

--
-- TOC entry 262 (class 1259 OID 16632)
-- Name: protocol_mapper; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.protocol_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    protocol character varying(255) NOT NULL,
    protocol_mapper_name character varying(255) NOT NULL,
    client_id character varying(36),
    client_scope_id character varying(36)
);


ALTER TABLE public.protocol_mapper OWNER TO kc_user;

--
-- TOC entry 263 (class 1259 OID 16637)
-- Name: protocol_mapper_config; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.protocol_mapper_config (
    protocol_mapper_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.protocol_mapper_config OWNER TO kc_user;

--
-- TOC entry 264 (class 1259 OID 16642)
-- Name: realm; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.realm (
    id character varying(36) NOT NULL,
    access_code_lifespan integer,
    user_action_lifespan integer,
    access_token_lifespan integer,
    account_theme character varying(255),
    admin_theme character varying(255),
    email_theme character varying(255),
    enabled boolean DEFAULT false NOT NULL,
    events_enabled boolean DEFAULT false NOT NULL,
    events_expiration bigint,
    login_theme character varying(255),
    name character varying(255),
    not_before integer,
    password_policy character varying(2550),
    registration_allowed boolean DEFAULT false NOT NULL,
    remember_me boolean DEFAULT false NOT NULL,
    reset_password_allowed boolean DEFAULT false NOT NULL,
    social boolean DEFAULT false NOT NULL,
    ssl_required character varying(255),
    sso_idle_timeout integer,
    sso_max_lifespan integer,
    update_profile_on_soc_login boolean DEFAULT false NOT NULL,
    verify_email boolean DEFAULT false NOT NULL,
    master_admin_client character varying(36),
    login_lifespan integer,
    internationalization_enabled boolean DEFAULT false NOT NULL,
    default_locale character varying(255),
    reg_email_as_username boolean DEFAULT false NOT NULL,
    admin_events_enabled boolean DEFAULT false NOT NULL,
    admin_events_details_enabled boolean DEFAULT false NOT NULL,
    edit_username_allowed boolean DEFAULT false NOT NULL,
    otp_policy_counter integer DEFAULT 0,
    otp_policy_window integer DEFAULT 1,
    otp_policy_period integer DEFAULT 30,
    otp_policy_digits integer DEFAULT 6,
    otp_policy_alg character varying(36) DEFAULT 'HmacSHA1'::character varying,
    otp_policy_type character varying(36) DEFAULT 'totp'::character varying,
    browser_flow character varying(36),
    registration_flow character varying(36),
    direct_grant_flow character varying(36),
    reset_credentials_flow character varying(36),
    client_auth_flow character varying(36),
    offline_session_idle_timeout integer DEFAULT 0,
    revoke_refresh_token boolean DEFAULT false NOT NULL,
    access_token_life_implicit integer DEFAULT 0,
    login_with_email_allowed boolean DEFAULT true NOT NULL,
    duplicate_emails_allowed boolean DEFAULT false NOT NULL,
    docker_auth_flow character varying(36),
    refresh_token_max_reuse integer DEFAULT 0,
    allow_user_managed_access boolean DEFAULT false NOT NULL,
    sso_max_lifespan_remember_me integer DEFAULT 0 NOT NULL,
    sso_idle_timeout_remember_me integer DEFAULT 0 NOT NULL,
    default_role character varying(255)
);


ALTER TABLE public.realm OWNER TO kc_user;

--
-- TOC entry 265 (class 1259 OID 16675)
-- Name: realm_attribute; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.realm_attribute (
    name character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    value text
);


ALTER TABLE public.realm_attribute OWNER TO kc_user;

--
-- TOC entry 266 (class 1259 OID 16680)
-- Name: realm_default_groups; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.realm_default_groups (
    realm_id character varying(36) NOT NULL,
    group_id character varying(36) NOT NULL
);


ALTER TABLE public.realm_default_groups OWNER TO kc_user;

--
-- TOC entry 267 (class 1259 OID 16683)
-- Name: realm_enabled_event_types; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.realm_enabled_event_types (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.realm_enabled_event_types OWNER TO kc_user;

--
-- TOC entry 268 (class 1259 OID 16686)
-- Name: realm_events_listeners; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.realm_events_listeners (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.realm_events_listeners OWNER TO kc_user;

--
-- TOC entry 269 (class 1259 OID 16689)
-- Name: realm_localizations; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.realm_localizations (
    realm_id character varying(255) NOT NULL,
    locale character varying(255) NOT NULL,
    texts text NOT NULL
);


ALTER TABLE public.realm_localizations OWNER TO kc_user;

--
-- TOC entry 270 (class 1259 OID 16694)
-- Name: realm_required_credential; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.realm_required_credential (
    type character varying(255) NOT NULL,
    form_label character varying(255),
    input boolean DEFAULT false NOT NULL,
    secret boolean DEFAULT false NOT NULL,
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.realm_required_credential OWNER TO kc_user;

--
-- TOC entry 271 (class 1259 OID 16701)
-- Name: realm_smtp_config; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.realm_smtp_config (
    realm_id character varying(36) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


ALTER TABLE public.realm_smtp_config OWNER TO kc_user;

--
-- TOC entry 272 (class 1259 OID 16706)
-- Name: realm_supported_locales; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.realm_supported_locales (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.realm_supported_locales OWNER TO kc_user;

--
-- TOC entry 273 (class 1259 OID 16709)
-- Name: redirect_uris; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.redirect_uris (
    client_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.redirect_uris OWNER TO kc_user;

--
-- TOC entry 274 (class 1259 OID 16712)
-- Name: required_action_config; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.required_action_config (
    required_action_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.required_action_config OWNER TO kc_user;

--
-- TOC entry 275 (class 1259 OID 16717)
-- Name: required_action_provider; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.required_action_provider (
    id character varying(36) NOT NULL,
    alias character varying(255),
    name character varying(255),
    realm_id character varying(36),
    enabled boolean DEFAULT false NOT NULL,
    default_action boolean DEFAULT false NOT NULL,
    provider_id character varying(255),
    priority integer
);


ALTER TABLE public.required_action_provider OWNER TO kc_user;

--
-- TOC entry 276 (class 1259 OID 16724)
-- Name: resource_attribute; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.resource_attribute (
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255),
    resource_id character varying(36) NOT NULL
);


ALTER TABLE public.resource_attribute OWNER TO kc_user;

--
-- TOC entry 277 (class 1259 OID 16730)
-- Name: resource_policy; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.resource_policy (
    resource_id character varying(36) NOT NULL,
    policy_id character varying(36) NOT NULL
);


ALTER TABLE public.resource_policy OWNER TO kc_user;

--
-- TOC entry 278 (class 1259 OID 16733)
-- Name: resource_scope; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.resource_scope (
    resource_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL
);


ALTER TABLE public.resource_scope OWNER TO kc_user;

--
-- TOC entry 279 (class 1259 OID 16736)
-- Name: resource_server; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.resource_server (
    id character varying(36) NOT NULL,
    allow_rs_remote_mgmt boolean DEFAULT false NOT NULL,
    policy_enforce_mode smallint NOT NULL,
    decision_strategy smallint DEFAULT 1 NOT NULL
);


ALTER TABLE public.resource_server OWNER TO kc_user;

--
-- TOC entry 280 (class 1259 OID 16741)
-- Name: resource_server_perm_ticket; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.resource_server_perm_ticket (
    id character varying(36) NOT NULL,
    owner character varying(255) NOT NULL,
    requester character varying(255) NOT NULL,
    created_timestamp bigint NOT NULL,
    granted_timestamp bigint,
    resource_id character varying(36) NOT NULL,
    scope_id character varying(36),
    resource_server_id character varying(36) NOT NULL,
    policy_id character varying(36)
);


ALTER TABLE public.resource_server_perm_ticket OWNER TO kc_user;

--
-- TOC entry 281 (class 1259 OID 16746)
-- Name: resource_server_policy; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.resource_server_policy (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    type character varying(255) NOT NULL,
    decision_strategy smallint,
    logic smallint,
    resource_server_id character varying(36) NOT NULL,
    owner character varying(255)
);


ALTER TABLE public.resource_server_policy OWNER TO kc_user;

--
-- TOC entry 282 (class 1259 OID 16751)
-- Name: resource_server_resource; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.resource_server_resource (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(255),
    icon_uri character varying(255),
    owner character varying(255) NOT NULL,
    resource_server_id character varying(36) NOT NULL,
    owner_managed_access boolean DEFAULT false NOT NULL,
    display_name character varying(255)
);


ALTER TABLE public.resource_server_resource OWNER TO kc_user;

--
-- TOC entry 283 (class 1259 OID 16757)
-- Name: resource_server_scope; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.resource_server_scope (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    icon_uri character varying(255),
    resource_server_id character varying(36) NOT NULL,
    display_name character varying(255)
);


ALTER TABLE public.resource_server_scope OWNER TO kc_user;

--
-- TOC entry 284 (class 1259 OID 16762)
-- Name: resource_uris; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.resource_uris (
    resource_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.resource_uris OWNER TO kc_user;

--
-- TOC entry 285 (class 1259 OID 16765)
-- Name: revoked_token; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.revoked_token (
    id character varying(255) NOT NULL,
    expire bigint NOT NULL
);


ALTER TABLE public.revoked_token OWNER TO kc_user;

--
-- TOC entry 286 (class 1259 OID 16768)
-- Name: role_attribute; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.role_attribute (
    id character varying(36) NOT NULL,
    role_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255)
);


ALTER TABLE public.role_attribute OWNER TO kc_user;

--
-- TOC entry 287 (class 1259 OID 16773)
-- Name: scope_mapping; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.scope_mapping (
    client_id character varying(36) NOT NULL,
    role_id character varying(36) NOT NULL
);


ALTER TABLE public.scope_mapping OWNER TO kc_user;

--
-- TOC entry 288 (class 1259 OID 16776)
-- Name: scope_policy; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.scope_policy (
    scope_id character varying(36) NOT NULL,
    policy_id character varying(36) NOT NULL
);


ALTER TABLE public.scope_policy OWNER TO kc_user;

--
-- TOC entry 289 (class 1259 OID 16779)
-- Name: server_config; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.server_config (
    server_config_key character varying(255) NOT NULL,
    value text NOT NULL,
    version integer DEFAULT 0
);


ALTER TABLE public.server_config OWNER TO kc_user;

--
-- TOC entry 290 (class 1259 OID 16785)
-- Name: user_attribute; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.user_attribute (
    name character varying(255) NOT NULL,
    value character varying(255),
    user_id character varying(36) NOT NULL,
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL,
    long_value_hash bytea,
    long_value_hash_lower_case bytea,
    long_value text
);


ALTER TABLE public.user_attribute OWNER TO kc_user;

--
-- TOC entry 291 (class 1259 OID 16791)
-- Name: user_consent; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.user_consent (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    user_id character varying(36) NOT NULL,
    created_date bigint,
    last_updated_date bigint,
    client_storage_provider character varying(36),
    external_client_id character varying(255)
);


ALTER TABLE public.user_consent OWNER TO kc_user;

--
-- TOC entry 292 (class 1259 OID 16796)
-- Name: user_consent_client_scope; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.user_consent_client_scope (
    user_consent_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL
);


ALTER TABLE public.user_consent_client_scope OWNER TO kc_user;

--
-- TOC entry 293 (class 1259 OID 16799)
-- Name: user_entity; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.user_entity (
    id character varying(36) NOT NULL,
    email character varying(255),
    email_constraint character varying(255),
    email_verified boolean DEFAULT false NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    federation_link character varying(255),
    first_name character varying(255),
    last_name character varying(255),
    realm_id character varying(255),
    username character varying(255),
    created_timestamp bigint,
    service_account_client_link character varying(255),
    not_before integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.user_entity OWNER TO kc_user;

--
-- TOC entry 294 (class 1259 OID 16807)
-- Name: user_federation_config; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.user_federation_config (
    user_federation_provider_id character varying(36) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


ALTER TABLE public.user_federation_config OWNER TO kc_user;

--
-- TOC entry 295 (class 1259 OID 16812)
-- Name: user_federation_mapper; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.user_federation_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    federation_provider_id character varying(36) NOT NULL,
    federation_mapper_type character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.user_federation_mapper OWNER TO kc_user;

--
-- TOC entry 296 (class 1259 OID 16817)
-- Name: user_federation_mapper_config; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.user_federation_mapper_config (
    user_federation_mapper_id character varying(36) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


ALTER TABLE public.user_federation_mapper_config OWNER TO kc_user;

--
-- TOC entry 297 (class 1259 OID 16822)
-- Name: user_federation_provider; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.user_federation_provider (
    id character varying(36) NOT NULL,
    changed_sync_period integer,
    display_name character varying(255),
    full_sync_period integer,
    last_sync integer,
    priority integer,
    provider_name character varying(255),
    realm_id character varying(36)
);


ALTER TABLE public.user_federation_provider OWNER TO kc_user;

--
-- TOC entry 298 (class 1259 OID 16827)
-- Name: user_group_membership; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.user_group_membership (
    group_id character varying(36) NOT NULL,
    user_id character varying(36) NOT NULL,
    membership_type character varying(255) NOT NULL
);


ALTER TABLE public.user_group_membership OWNER TO kc_user;

--
-- TOC entry 299 (class 1259 OID 16830)
-- Name: user_required_action; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.user_required_action (
    user_id character varying(36) NOT NULL,
    required_action character varying(255) DEFAULT ' '::character varying NOT NULL
);


ALTER TABLE public.user_required_action OWNER TO kc_user;

--
-- TOC entry 300 (class 1259 OID 16834)
-- Name: user_role_mapping; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.user_role_mapping (
    role_id character varying(255) NOT NULL,
    user_id character varying(36) NOT NULL
);


ALTER TABLE public.user_role_mapping OWNER TO kc_user;

--
-- TOC entry 301 (class 1259 OID 16837)
-- Name: web_origins; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.web_origins (
    client_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.web_origins OWNER TO kc_user;

--
-- TOC entry 302 (class 1259 OID 16840)
-- Name: workflow_state; Type: TABLE; Schema: public; Owner: kc_user
--

CREATE TABLE public.workflow_state (
    execution_id character varying(255) NOT NULL,
    resource_id character varying(255) NOT NULL,
    workflow_id character varying(255) NOT NULL,
    workflow_provider_id character varying(255),
    resource_type character varying(255),
    scheduled_step_id character varying(255),
    scheduled_step_timestamp bigint
);


ALTER TABLE public.workflow_state OWNER TO kc_user;

--
-- TOC entry 4211 (class 0 OID 16385)
-- Dependencies: 214
-- Data for Name: admin_event_entity; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4212 (class 0 OID 16390)
-- Dependencies: 215
-- Data for Name: associated_policy; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4213 (class 0 OID 16393)
-- Dependencies: 216
-- Data for Name: authentication_execution; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.authentication_execution VALUES ('ef34f8ae-5e2f-42a9-8b94-a4d4838d3412', NULL, 'auth-cookie', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'affbec2d-069d-4f2a-9b65-af333fbf5548', 2, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('34fb1a64-2f4f-47bf-81e8-fb6e3630e091', NULL, 'auth-spnego', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'affbec2d-069d-4f2a-9b65-af333fbf5548', 3, 20, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('f5900985-6db5-401d-a96e-dcf9eb550301', NULL, 'identity-provider-redirector', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'affbec2d-069d-4f2a-9b65-af333fbf5548', 2, 25, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('9d98d569-c7b2-4dc0-9514-d46683aeaf87', NULL, NULL, '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'affbec2d-069d-4f2a-9b65-af333fbf5548', 2, 30, true, '27dc2927-072f-4226-88ef-dbf55eac171a', NULL);
INSERT INTO public.authentication_execution VALUES ('5aaadf80-5068-4eca-a6e0-471a910db927', NULL, 'auth-username-password-form', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '27dc2927-072f-4226-88ef-dbf55eac171a', 0, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('8cd64af5-7535-4980-8c98-fbc5cb29cbf4', NULL, NULL, '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '27dc2927-072f-4226-88ef-dbf55eac171a', 1, 20, true, '8e2b2d39-73ba-4c4e-aeb3-63ac452164cb', NULL);
INSERT INTO public.authentication_execution VALUES ('3a6a2cb3-e425-4013-ae9f-8abd9aac6255', NULL, 'conditional-user-configured', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '8e2b2d39-73ba-4c4e-aeb3-63ac452164cb', 0, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('98e941e9-f9c0-45f1-b653-042bec0094ed', NULL, 'conditional-credential', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '8e2b2d39-73ba-4c4e-aeb3-63ac452164cb', 0, 20, false, NULL, '6aacc659-dbda-45c8-a58c-31922d242e8f');
INSERT INTO public.authentication_execution VALUES ('e23a12af-adce-4135-b6df-be8209b98fe1', NULL, 'auth-otp-form', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '8e2b2d39-73ba-4c4e-aeb3-63ac452164cb', 2, 30, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('3b516a58-3753-400d-baf3-f51df956f520', NULL, 'webauthn-authenticator', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '8e2b2d39-73ba-4c4e-aeb3-63ac452164cb', 3, 40, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('f134b65b-8d68-4826-9d56-d6045f5f6241', NULL, 'auth-recovery-authn-code-form', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '8e2b2d39-73ba-4c4e-aeb3-63ac452164cb', 3, 50, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('c869326b-3788-4ddb-8800-1f2e6ca55fb8', NULL, 'direct-grant-validate-username', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '6102b505-eabb-4779-828c-2cb57638e709', 0, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('2e43f476-c7db-487d-ba39-be634cdabcd6', NULL, 'direct-grant-validate-password', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '6102b505-eabb-4779-828c-2cb57638e709', 0, 20, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('6e9123f2-d648-47cc-b0a6-57f1936fb64e', NULL, NULL, '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '6102b505-eabb-4779-828c-2cb57638e709', 1, 30, true, '3d06b96a-3b01-48d9-9548-81231fcbd6a5', NULL);
INSERT INTO public.authentication_execution VALUES ('455cbc90-f818-439a-a4c0-0c7468c36a68', NULL, 'conditional-user-configured', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '3d06b96a-3b01-48d9-9548-81231fcbd6a5', 0, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('2d4978fa-42ef-4162-bc35-2ff5a9bc0bed', NULL, 'direct-grant-validate-otp', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '3d06b96a-3b01-48d9-9548-81231fcbd6a5', 0, 20, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('9837c73a-244c-49b6-ab2b-82e4a4f4e9a3', NULL, 'registration-page-form', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '61fb27e0-6c9f-4b85-a10d-8b1edb66ea4d', 0, 10, true, '3c9e5ba2-0ff4-418a-a7fd-43e24756cb05', NULL);
INSERT INTO public.authentication_execution VALUES ('10674511-9650-4435-9fa4-c40c72fa0bf6', NULL, 'registration-user-creation', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '3c9e5ba2-0ff4-418a-a7fd-43e24756cb05', 0, 20, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('18d43c94-d3bb-4a81-83c6-f01a31794ac7', NULL, 'registration-password-action', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '3c9e5ba2-0ff4-418a-a7fd-43e24756cb05', 0, 50, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('85e74cb9-46f1-4613-8fa7-cc28ee126c5c', NULL, 'registration-recaptcha-action', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '3c9e5ba2-0ff4-418a-a7fd-43e24756cb05', 3, 60, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('d61468eb-a089-4ec1-b36f-f33c8901c665', NULL, 'registration-terms-and-conditions', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '3c9e5ba2-0ff4-418a-a7fd-43e24756cb05', 3, 70, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('d5cb9c61-605a-4d49-a00c-ca298f103d22', NULL, 'reset-credentials-choose-user', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '2a34c928-55ff-439e-8b01-a5f86a8f07ce', 0, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('bc67385d-391f-4aac-acb6-a0b1efd55b5a', NULL, 'reset-credential-email', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '2a34c928-55ff-439e-8b01-a5f86a8f07ce', 0, 20, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('a5a63e03-a36b-4ba8-98e5-39f394f60523', NULL, 'reset-password', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '2a34c928-55ff-439e-8b01-a5f86a8f07ce', 0, 30, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('cb2b12eb-f4a5-4b3e-9109-d4134a479347', NULL, NULL, '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '2a34c928-55ff-439e-8b01-a5f86a8f07ce', 1, 40, true, '3088194b-9ee9-42aa-a381-9096e897bdbb', NULL);
INSERT INTO public.authentication_execution VALUES ('0024b6a9-42d8-428d-95d5-ab8849fc46e0', NULL, 'conditional-user-configured', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '3088194b-9ee9-42aa-a381-9096e897bdbb', 0, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('08518592-0671-4ad9-8e9e-a4a1aa43efb7', NULL, 'reset-otp', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '3088194b-9ee9-42aa-a381-9096e897bdbb', 0, 20, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('96329b67-6d18-47d9-b646-82958be7ae94', NULL, 'client-secret', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '2b0867c1-b64a-4ee6-b6b6-af336d9e78bf', 2, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('453b56ee-81fd-480a-b786-0aea1da9bc59', NULL, 'client-jwt', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '2b0867c1-b64a-4ee6-b6b6-af336d9e78bf', 2, 20, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('5e60b4a6-cb36-4b9d-9d91-7830cea9b076', NULL, 'client-secret-jwt', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '2b0867c1-b64a-4ee6-b6b6-af336d9e78bf', 2, 30, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('81dfb365-581e-4889-88ad-e3f8d0a74b1a', NULL, 'client-x509', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '2b0867c1-b64a-4ee6-b6b6-af336d9e78bf', 2, 40, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('b8f8a9b9-15a1-4091-8e8a-a472e1cb728d', NULL, 'idp-review-profile', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'd210a888-0779-446a-9d05-f23737ed5cbb', 0, 10, false, NULL, 'f156e486-1a60-48ae-9ec9-92b68f943b6f');
INSERT INTO public.authentication_execution VALUES ('49543c1e-0593-4f26-af97-2cae5a1f26bc', NULL, NULL, '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'd210a888-0779-446a-9d05-f23737ed5cbb', 0, 20, true, '23afba76-f383-44ee-a9e4-858bb97655cd', NULL);
INSERT INTO public.authentication_execution VALUES ('f4010608-67d1-49c5-941e-1037a3811482', NULL, 'idp-create-user-if-unique', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '23afba76-f383-44ee-a9e4-858bb97655cd', 2, 10, false, NULL, '21ba4fe9-7204-4524-b1b5-6d1e60493604');
INSERT INTO public.authentication_execution VALUES ('54905657-a687-4e5a-b588-fa4d2289df63', NULL, NULL, '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '23afba76-f383-44ee-a9e4-858bb97655cd', 2, 20, true, 'e26d22ec-9c0b-4507-85b6-518d661b5b4b', NULL);
INSERT INTO public.authentication_execution VALUES ('b77b7327-9126-474d-9a27-6a0f083fc68e', NULL, 'idp-confirm-link', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'e26d22ec-9c0b-4507-85b6-518d661b5b4b', 0, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('68554716-5f90-4686-a2b5-db6555989286', NULL, NULL, '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'e26d22ec-9c0b-4507-85b6-518d661b5b4b', 0, 20, true, '1699d99e-46cd-4dfd-bbd6-393debc4f317', NULL);
INSERT INTO public.authentication_execution VALUES ('4f92e45d-7e66-46b6-982e-b24358d5d698', NULL, 'idp-email-verification', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '1699d99e-46cd-4dfd-bbd6-393debc4f317', 2, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('b4f2a237-c876-4881-81a3-666fbef92d6e', NULL, NULL, '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '1699d99e-46cd-4dfd-bbd6-393debc4f317', 2, 20, true, '4353924a-aee9-4a13-9a70-02ff55f84bfa', NULL);
INSERT INTO public.authentication_execution VALUES ('5948db6a-1d2a-4eb4-b05e-5fb0dbaf1262', NULL, 'idp-username-password-form', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '4353924a-aee9-4a13-9a70-02ff55f84bfa', 0, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('888e78d8-d027-42fe-809d-cc26ef7520a5', NULL, NULL, '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '4353924a-aee9-4a13-9a70-02ff55f84bfa', 1, 20, true, '2f0682d0-38ba-4ce3-a88d-94e80b4b84de', NULL);
INSERT INTO public.authentication_execution VALUES ('200c3b04-f6e9-4e40-9565-550fefac3c11', NULL, 'conditional-user-configured', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '2f0682d0-38ba-4ce3-a88d-94e80b4b84de', 0, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('67ea9d6f-0e29-4691-83ec-96a07707fbe9', NULL, 'conditional-credential', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '2f0682d0-38ba-4ce3-a88d-94e80b4b84de', 0, 20, false, NULL, '0b958b18-5d29-4da5-8a25-d2572ee7f3a0');
INSERT INTO public.authentication_execution VALUES ('875e8730-4574-43e5-89ec-06f716abb962', NULL, 'auth-otp-form', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '2f0682d0-38ba-4ce3-a88d-94e80b4b84de', 2, 30, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('672f51d6-6df6-461f-b585-f3b5de59b044', NULL, 'webauthn-authenticator', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '2f0682d0-38ba-4ce3-a88d-94e80b4b84de', 3, 40, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('edf60aaf-f976-4896-9927-fe8ef66285eb', NULL, 'auth-recovery-authn-code-form', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '2f0682d0-38ba-4ce3-a88d-94e80b4b84de', 3, 50, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('1909b4b5-8adb-48ea-b6c3-e6e89448b51b', NULL, 'http-basic-authenticator', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '5f8c24a0-3fe3-4d67-871f-f885e0cb51cb', 0, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('76700b58-8a60-4bfb-9091-cd0790b5b02c', NULL, 'docker-http-basic-authenticator', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '822d5bc8-000d-46a4-912e-8b520f0d7d0a', 0, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('925f0aa2-ad88-443d-977d-c6319d9b189c', NULL, 'auth-cookie', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '32394dcf-6da2-4e7d-b6fa-6acef44b4833', 2, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('46c8e32a-f764-4a4d-9fb1-f1ffeb105557', NULL, 'auth-spnego', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '32394dcf-6da2-4e7d-b6fa-6acef44b4833', 3, 20, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('29df301b-d76d-4630-b0c6-8b0c950be961', NULL, 'identity-provider-redirector', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '32394dcf-6da2-4e7d-b6fa-6acef44b4833', 2, 25, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('beeec4fb-0709-4edf-8303-ec7b0824731a', NULL, NULL, '000c9ecc-9c3a-44d3-94fe-941ff152490f', '32394dcf-6da2-4e7d-b6fa-6acef44b4833', 2, 30, true, 'd37448d5-8cde-41f2-bd71-ddaf4442f63f', NULL);
INSERT INTO public.authentication_execution VALUES ('f0e4251f-6f60-4a09-a6ba-214cc4e95830', NULL, 'auth-username-password-form', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'd37448d5-8cde-41f2-bd71-ddaf4442f63f', 0, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('e8959129-3a03-4f51-9580-996f5a3dfd00', NULL, NULL, '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'd37448d5-8cde-41f2-bd71-ddaf4442f63f', 1, 20, true, '707c74c7-d26d-40bc-a83e-fe15ffdc0e6b', NULL);
INSERT INTO public.authentication_execution VALUES ('9094be00-4342-4846-8a16-8cdc5044d191', NULL, 'conditional-user-configured', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '707c74c7-d26d-40bc-a83e-fe15ffdc0e6b', 0, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('95e72fd6-b775-4962-b3fe-bf6f69bb571a', NULL, 'conditional-credential', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '707c74c7-d26d-40bc-a83e-fe15ffdc0e6b', 0, 20, false, NULL, '7293b199-3657-4d53-b049-6104c58f5aa9');
INSERT INTO public.authentication_execution VALUES ('7b45575c-b221-4c76-9ad9-9da77d299aa2', NULL, 'auth-otp-form', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '707c74c7-d26d-40bc-a83e-fe15ffdc0e6b', 2, 30, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('98cb0259-43f1-4d1f-b7bd-522f73b721a8', NULL, 'webauthn-authenticator', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '707c74c7-d26d-40bc-a83e-fe15ffdc0e6b', 3, 40, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('25385b93-8697-44e5-b8cd-0307984b6517', NULL, 'auth-recovery-authn-code-form', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '707c74c7-d26d-40bc-a83e-fe15ffdc0e6b', 3, 50, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('37745e86-fe45-4705-9151-b8d2d3e03738', NULL, NULL, '000c9ecc-9c3a-44d3-94fe-941ff152490f', '32394dcf-6da2-4e7d-b6fa-6acef44b4833', 2, 26, true, '877e8020-9ad4-4d67-82b4-8a5bfbac09a2', NULL);
INSERT INTO public.authentication_execution VALUES ('5b7b49dd-cf40-4207-ab94-0ac96229c7e2', NULL, NULL, '000c9ecc-9c3a-44d3-94fe-941ff152490f', '877e8020-9ad4-4d67-82b4-8a5bfbac09a2', 1, 10, true, '8fca0665-3bfc-40ea-948b-0ae9a7608688', NULL);
INSERT INTO public.authentication_execution VALUES ('749be286-5a8b-499a-9b8d-a46105bbb7f3', NULL, 'conditional-user-configured', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '8fca0665-3bfc-40ea-948b-0ae9a7608688', 0, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('c5a365c6-e617-4321-ac5b-d6d0a9c1c08d', NULL, 'organization', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '8fca0665-3bfc-40ea-948b-0ae9a7608688', 2, 20, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('3962038b-57d5-49ba-aae2-338012ed70fb', NULL, 'direct-grant-validate-username', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '94bc9f25-d56c-46c9-8913-1a1dcbbbac40', 0, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('5bce9eaf-0e32-45e4-8935-6783a63ef919', NULL, 'direct-grant-validate-password', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '94bc9f25-d56c-46c9-8913-1a1dcbbbac40', 0, 20, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('e320c9b6-bc79-4f26-93b3-3520ca75069a', NULL, NULL, '000c9ecc-9c3a-44d3-94fe-941ff152490f', '94bc9f25-d56c-46c9-8913-1a1dcbbbac40', 1, 30, true, 'e7adc221-2e9f-4e34-ab8b-d58f4a861594', NULL);
INSERT INTO public.authentication_execution VALUES ('585971a2-2ec6-42ea-909e-c52705dbefbe', NULL, 'conditional-user-configured', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'e7adc221-2e9f-4e34-ab8b-d58f4a861594', 0, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('a7c2343d-e2be-4d97-a935-bc06dbe28901', NULL, 'direct-grant-validate-otp', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'e7adc221-2e9f-4e34-ab8b-d58f4a861594', 0, 20, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('22895a0c-7c46-41e1-8e46-9adf9705f10b', NULL, 'registration-page-form', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '35f3caa7-69c6-4398-b74f-aa741f19159e', 0, 10, true, 'b7afaeee-7f40-49c2-bc7e-14e3c2a272c4', NULL);
INSERT INTO public.authentication_execution VALUES ('683bc0d9-f673-4490-a65a-f12dc733e89a', NULL, 'registration-user-creation', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'b7afaeee-7f40-49c2-bc7e-14e3c2a272c4', 0, 20, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('7fe3da19-a974-4507-8778-07fefb271dd0', NULL, 'registration-password-action', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'b7afaeee-7f40-49c2-bc7e-14e3c2a272c4', 0, 50, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('608feba8-bc19-467e-afe6-53b4118e63a8', NULL, 'registration-recaptcha-action', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'b7afaeee-7f40-49c2-bc7e-14e3c2a272c4', 3, 60, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('151fc80f-daad-499c-a106-2ac79c7f44da', NULL, 'registration-terms-and-conditions', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'b7afaeee-7f40-49c2-bc7e-14e3c2a272c4', 3, 70, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('50ce8ecf-8cdf-488c-9d9a-9eec0f5ff8c7', NULL, 'reset-credentials-choose-user', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'd594204e-3632-4604-8eb4-bcd7f91c30cc', 0, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('26f598b8-4a4e-4b53-a09e-3df1dff41f4a', NULL, 'reset-credential-email', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'd594204e-3632-4604-8eb4-bcd7f91c30cc', 0, 20, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('3ab84b09-ec7a-4b24-81d1-5de27229a6d0', NULL, 'reset-password', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'd594204e-3632-4604-8eb4-bcd7f91c30cc', 0, 30, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('3c84a28b-6df1-4487-9137-3ec7b1ad7d45', NULL, NULL, '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'd594204e-3632-4604-8eb4-bcd7f91c30cc', 1, 40, true, '477e22f2-f460-4496-9e60-446531dfa78f', NULL);
INSERT INTO public.authentication_execution VALUES ('e7797254-2e0a-43b4-9705-e6c39db36674', NULL, 'conditional-user-configured', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '477e22f2-f460-4496-9e60-446531dfa78f', 0, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('c9e2f38c-7190-400a-b1cd-9300e064b9a4', NULL, 'reset-otp', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '477e22f2-f460-4496-9e60-446531dfa78f', 0, 20, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('8b326296-66e7-4018-949e-5ac8d4c242e7', NULL, 'client-secret', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '14f6eb27-14f0-4c17-929f-8cb4056ee86b', 2, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('63ec2036-bb9b-4277-bba7-648893818332', NULL, 'client-jwt', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '14f6eb27-14f0-4c17-929f-8cb4056ee86b', 2, 20, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('3ca88835-c229-41f1-a74f-80be5c753f2c', NULL, 'client-secret-jwt', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '14f6eb27-14f0-4c17-929f-8cb4056ee86b', 2, 30, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('96500a8b-3631-4b93-8c93-a63a5f08ef36', NULL, 'client-x509', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '14f6eb27-14f0-4c17-929f-8cb4056ee86b', 2, 40, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('424d3ad2-432d-4757-9686-1cffae2df08e', NULL, 'idp-review-profile', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '60508573-3af1-4a51-990f-2b51c9f74b09', 0, 10, false, NULL, '7a91b663-1e20-45df-a888-4ff924bac407');
INSERT INTO public.authentication_execution VALUES ('e4a0ec11-e45c-42cc-bd6f-6b97146d5992', NULL, NULL, '000c9ecc-9c3a-44d3-94fe-941ff152490f', '60508573-3af1-4a51-990f-2b51c9f74b09', 0, 20, true, '007b8af0-019c-4c7d-9ab6-4086c5e828b9', NULL);
INSERT INTO public.authentication_execution VALUES ('eba8e49d-a824-4694-bec3-30bed63696da', NULL, 'idp-create-user-if-unique', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '007b8af0-019c-4c7d-9ab6-4086c5e828b9', 2, 10, false, NULL, 'd8629046-b03c-423b-803e-9a3c2a687f33');
INSERT INTO public.authentication_execution VALUES ('84c4fa16-babc-4428-920d-07a0a77a2de2', NULL, NULL, '000c9ecc-9c3a-44d3-94fe-941ff152490f', '007b8af0-019c-4c7d-9ab6-4086c5e828b9', 2, 20, true, 'fb96022b-15f9-4c82-812e-d69013d1fe3b', NULL);
INSERT INTO public.authentication_execution VALUES ('a017ff06-2124-4c8a-af4b-d479f99902e8', NULL, 'idp-confirm-link', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'fb96022b-15f9-4c82-812e-d69013d1fe3b', 0, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('6311c8bc-e8ed-4baa-ad43-e382555ce935', NULL, NULL, '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'fb96022b-15f9-4c82-812e-d69013d1fe3b', 0, 20, true, '298c6943-8d29-407b-b6b2-add932157df8', NULL);
INSERT INTO public.authentication_execution VALUES ('20ce4eaa-3d21-4cb5-ab12-fc41837ba554', NULL, 'idp-email-verification', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '298c6943-8d29-407b-b6b2-add932157df8', 2, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('479de9aa-cbbf-40a0-96a3-3de005d4a14a', NULL, NULL, '000c9ecc-9c3a-44d3-94fe-941ff152490f', '298c6943-8d29-407b-b6b2-add932157df8', 2, 20, true, 'cee7157a-a903-4611-9f60-cd690ea3b48c', NULL);
INSERT INTO public.authentication_execution VALUES ('20c5fd81-91c5-4bc0-a29d-92057d50136b', NULL, 'idp-username-password-form', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'cee7157a-a903-4611-9f60-cd690ea3b48c', 0, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('7504ce09-b3b5-4c33-b89c-8781d0c3e09b', NULL, NULL, '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'cee7157a-a903-4611-9f60-cd690ea3b48c', 1, 20, true, '9d27bd2a-64c9-4ed3-9fe8-a07d593d4b65', NULL);
INSERT INTO public.authentication_execution VALUES ('6fb371c4-ebad-4587-a81a-d896b58cdec9', NULL, 'conditional-user-configured', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '9d27bd2a-64c9-4ed3-9fe8-a07d593d4b65', 0, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('07c55a93-ac62-416a-8e47-707c548e1e79', NULL, 'conditional-credential', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '9d27bd2a-64c9-4ed3-9fe8-a07d593d4b65', 0, 20, false, NULL, '2d96bd2a-7e11-4a6c-b20b-1244c99a9b01');
INSERT INTO public.authentication_execution VALUES ('2eb1be5b-5d3d-4038-b7d6-3fd461653a6a', NULL, 'auth-otp-form', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '9d27bd2a-64c9-4ed3-9fe8-a07d593d4b65', 2, 30, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('319d7a4d-3ae0-45e5-a093-49086fd46a1e', NULL, 'webauthn-authenticator', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '9d27bd2a-64c9-4ed3-9fe8-a07d593d4b65', 3, 40, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('8bb1c507-d963-483f-9c59-10a0a641d516', NULL, 'auth-recovery-authn-code-form', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '9d27bd2a-64c9-4ed3-9fe8-a07d593d4b65', 3, 50, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('2e4c3270-57ca-4c99-b71d-6909699e8168', NULL, NULL, '000c9ecc-9c3a-44d3-94fe-941ff152490f', '60508573-3af1-4a51-990f-2b51c9f74b09', 1, 60, true, '43b3fcf4-6018-4d89-9995-4a0dc8729e28', NULL);
INSERT INTO public.authentication_execution VALUES ('2337ab43-fe78-4f77-b632-9fa0d8018c00', NULL, 'conditional-user-configured', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '43b3fcf4-6018-4d89-9995-4a0dc8729e28', 0, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('d688768b-16fb-4645-85d7-49426dff1026', NULL, 'idp-add-organization-member', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '43b3fcf4-6018-4d89-9995-4a0dc8729e28', 0, 20, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('0f14c667-02c9-45b5-9f13-98f8bb1586ae', NULL, 'http-basic-authenticator', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'a9df4bfa-8957-40ee-9a79-82c4de6838fa', 0, 10, false, NULL, NULL);
INSERT INTO public.authentication_execution VALUES ('1b47454b-091f-4ff6-815b-0faf06b5b681', NULL, 'docker-http-basic-authenticator', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '0d4cabac-b754-4c13-86dd-eeca0bbbb374', 0, 10, false, NULL, NULL);


--
-- TOC entry 4214 (class 0 OID 16397)
-- Dependencies: 217
-- Data for Name: authentication_flow; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.authentication_flow VALUES ('affbec2d-069d-4f2a-9b65-af333fbf5548', 'browser', 'Browser based authentication', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'basic-flow', true, true);
INSERT INTO public.authentication_flow VALUES ('27dc2927-072f-4226-88ef-dbf55eac171a', 'forms', 'Username, password, otp and other auth forms.', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'basic-flow', false, true);
INSERT INTO public.authentication_flow VALUES ('8e2b2d39-73ba-4c4e-aeb3-63ac452164cb', 'Browser - Conditional 2FA', 'Flow to determine if any 2FA is required for the authentication', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'basic-flow', false, true);
INSERT INTO public.authentication_flow VALUES ('6102b505-eabb-4779-828c-2cb57638e709', 'direct grant', 'OpenID Connect Resource Owner Grant', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'basic-flow', true, true);
INSERT INTO public.authentication_flow VALUES ('3d06b96a-3b01-48d9-9548-81231fcbd6a5', 'Direct Grant - Conditional OTP', 'Flow to determine if the OTP is required for the authentication', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'basic-flow', false, true);
INSERT INTO public.authentication_flow VALUES ('61fb27e0-6c9f-4b85-a10d-8b1edb66ea4d', 'registration', 'Registration flow', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'basic-flow', true, true);
INSERT INTO public.authentication_flow VALUES ('3c9e5ba2-0ff4-418a-a7fd-43e24756cb05', 'registration form', 'Registration form', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'form-flow', false, true);
INSERT INTO public.authentication_flow VALUES ('2a34c928-55ff-439e-8b01-a5f86a8f07ce', 'reset credentials', 'Reset credentials for a user if they forgot their password or something', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'basic-flow', true, true);
INSERT INTO public.authentication_flow VALUES ('3088194b-9ee9-42aa-a381-9096e897bdbb', 'Reset - Conditional OTP', 'Flow to determine if the OTP should be reset or not. Set to REQUIRED to force.', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'basic-flow', false, true);
INSERT INTO public.authentication_flow VALUES ('2b0867c1-b64a-4ee6-b6b6-af336d9e78bf', 'clients', 'Base authentication for clients', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'client-flow', true, true);
INSERT INTO public.authentication_flow VALUES ('d210a888-0779-446a-9d05-f23737ed5cbb', 'first broker login', 'Actions taken after first broker login with identity provider account, which is not yet linked to any Keycloak account', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'basic-flow', true, true);
INSERT INTO public.authentication_flow VALUES ('23afba76-f383-44ee-a9e4-858bb97655cd', 'User creation or linking', 'Flow for the existing/non-existing user alternatives', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'basic-flow', false, true);
INSERT INTO public.authentication_flow VALUES ('e26d22ec-9c0b-4507-85b6-518d661b5b4b', 'Handle Existing Account', 'Handle what to do if there is existing account with same email/username like authenticated identity provider', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'basic-flow', false, true);
INSERT INTO public.authentication_flow VALUES ('1699d99e-46cd-4dfd-bbd6-393debc4f317', 'Account verification options', 'Method with which to verity the existing account', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'basic-flow', false, true);
INSERT INTO public.authentication_flow VALUES ('4353924a-aee9-4a13-9a70-02ff55f84bfa', 'Verify Existing Account by Re-authentication', 'Reauthentication of existing account', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'basic-flow', false, true);
INSERT INTO public.authentication_flow VALUES ('2f0682d0-38ba-4ce3-a88d-94e80b4b84de', 'First broker login - Conditional 2FA', 'Flow to determine if any 2FA is required for the authentication', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'basic-flow', false, true);
INSERT INTO public.authentication_flow VALUES ('5f8c24a0-3fe3-4d67-871f-f885e0cb51cb', 'saml ecp', 'SAML ECP Profile Authentication Flow', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'basic-flow', true, true);
INSERT INTO public.authentication_flow VALUES ('822d5bc8-000d-46a4-912e-8b520f0d7d0a', 'docker auth', 'Used by Docker clients to authenticate against the IDP', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'basic-flow', true, true);
INSERT INTO public.authentication_flow VALUES ('32394dcf-6da2-4e7d-b6fa-6acef44b4833', 'browser', 'Browser based authentication', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'basic-flow', true, true);
INSERT INTO public.authentication_flow VALUES ('d37448d5-8cde-41f2-bd71-ddaf4442f63f', 'forms', 'Username, password, otp and other auth forms.', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'basic-flow', false, true);
INSERT INTO public.authentication_flow VALUES ('707c74c7-d26d-40bc-a83e-fe15ffdc0e6b', 'Browser - Conditional 2FA', 'Flow to determine if any 2FA is required for the authentication', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'basic-flow', false, true);
INSERT INTO public.authentication_flow VALUES ('877e8020-9ad4-4d67-82b4-8a5bfbac09a2', 'Organization', NULL, '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'basic-flow', false, true);
INSERT INTO public.authentication_flow VALUES ('8fca0665-3bfc-40ea-948b-0ae9a7608688', 'Browser - Conditional Organization', 'Flow to determine if the organization identity-first login is to be used', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'basic-flow', false, true);
INSERT INTO public.authentication_flow VALUES ('94bc9f25-d56c-46c9-8913-1a1dcbbbac40', 'direct grant', 'OpenID Connect Resource Owner Grant', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'basic-flow', true, true);
INSERT INTO public.authentication_flow VALUES ('e7adc221-2e9f-4e34-ab8b-d58f4a861594', 'Direct Grant - Conditional OTP', 'Flow to determine if the OTP is required for the authentication', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'basic-flow', false, true);
INSERT INTO public.authentication_flow VALUES ('35f3caa7-69c6-4398-b74f-aa741f19159e', 'registration', 'Registration flow', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'basic-flow', true, true);
INSERT INTO public.authentication_flow VALUES ('b7afaeee-7f40-49c2-bc7e-14e3c2a272c4', 'registration form', 'Registration form', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'form-flow', false, true);
INSERT INTO public.authentication_flow VALUES ('d594204e-3632-4604-8eb4-bcd7f91c30cc', 'reset credentials', 'Reset credentials for a user if they forgot their password or something', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'basic-flow', true, true);
INSERT INTO public.authentication_flow VALUES ('477e22f2-f460-4496-9e60-446531dfa78f', 'Reset - Conditional OTP', 'Flow to determine if the OTP should be reset or not. Set to REQUIRED to force.', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'basic-flow', false, true);
INSERT INTO public.authentication_flow VALUES ('14f6eb27-14f0-4c17-929f-8cb4056ee86b', 'clients', 'Base authentication for clients', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'client-flow', true, true);
INSERT INTO public.authentication_flow VALUES ('60508573-3af1-4a51-990f-2b51c9f74b09', 'first broker login', 'Actions taken after first broker login with identity provider account, which is not yet linked to any Keycloak account', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'basic-flow', true, true);
INSERT INTO public.authentication_flow VALUES ('007b8af0-019c-4c7d-9ab6-4086c5e828b9', 'User creation or linking', 'Flow for the existing/non-existing user alternatives', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'basic-flow', false, true);
INSERT INTO public.authentication_flow VALUES ('fb96022b-15f9-4c82-812e-d69013d1fe3b', 'Handle Existing Account', 'Handle what to do if there is existing account with same email/username like authenticated identity provider', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'basic-flow', false, true);
INSERT INTO public.authentication_flow VALUES ('298c6943-8d29-407b-b6b2-add932157df8', 'Account verification options', 'Method with which to verity the existing account', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'basic-flow', false, true);
INSERT INTO public.authentication_flow VALUES ('cee7157a-a903-4611-9f60-cd690ea3b48c', 'Verify Existing Account by Re-authentication', 'Reauthentication of existing account', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'basic-flow', false, true);
INSERT INTO public.authentication_flow VALUES ('9d27bd2a-64c9-4ed3-9fe8-a07d593d4b65', 'First broker login - Conditional 2FA', 'Flow to determine if any 2FA is required for the authentication', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'basic-flow', false, true);
INSERT INTO public.authentication_flow VALUES ('43b3fcf4-6018-4d89-9995-4a0dc8729e28', 'First Broker Login - Conditional Organization', 'Flow to determine if the authenticator that adds organization members is to be used', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'basic-flow', false, true);
INSERT INTO public.authentication_flow VALUES ('a9df4bfa-8957-40ee-9a79-82c4de6838fa', 'saml ecp', 'SAML ECP Profile Authentication Flow', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'basic-flow', true, true);
INSERT INTO public.authentication_flow VALUES ('0d4cabac-b754-4c13-86dd-eeca0bbbb374', 'docker auth', 'Used by Docker clients to authenticate against the IDP', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'basic-flow', true, true);


--
-- TOC entry 4215 (class 0 OID 16405)
-- Dependencies: 218
-- Data for Name: authenticator_config; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.authenticator_config VALUES ('6aacc659-dbda-45c8-a58c-31922d242e8f', 'browser-conditional-credential', '0666ea4e-c88f-4e30-bf74-4874c0b2484d');
INSERT INTO public.authenticator_config VALUES ('f156e486-1a60-48ae-9ec9-92b68f943b6f', 'review profile config', '0666ea4e-c88f-4e30-bf74-4874c0b2484d');
INSERT INTO public.authenticator_config VALUES ('21ba4fe9-7204-4524-b1b5-6d1e60493604', 'create unique user config', '0666ea4e-c88f-4e30-bf74-4874c0b2484d');
INSERT INTO public.authenticator_config VALUES ('0b958b18-5d29-4da5-8a25-d2572ee7f3a0', 'first-broker-login-conditional-credential', '0666ea4e-c88f-4e30-bf74-4874c0b2484d');
INSERT INTO public.authenticator_config VALUES ('7293b199-3657-4d53-b049-6104c58f5aa9', 'browser-conditional-credential', '000c9ecc-9c3a-44d3-94fe-941ff152490f');
INSERT INTO public.authenticator_config VALUES ('7a91b663-1e20-45df-a888-4ff924bac407', 'review profile config', '000c9ecc-9c3a-44d3-94fe-941ff152490f');
INSERT INTO public.authenticator_config VALUES ('d8629046-b03c-423b-803e-9a3c2a687f33', 'create unique user config', '000c9ecc-9c3a-44d3-94fe-941ff152490f');
INSERT INTO public.authenticator_config VALUES ('2d96bd2a-7e11-4a6c-b20b-1244c99a9b01', 'first-broker-login-conditional-credential', '000c9ecc-9c3a-44d3-94fe-941ff152490f');


--
-- TOC entry 4216 (class 0 OID 16408)
-- Dependencies: 219
-- Data for Name: authenticator_config_entry; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.authenticator_config_entry VALUES ('0b958b18-5d29-4da5-8a25-d2572ee7f3a0', 'webauthn-passwordless', 'credentials');
INSERT INTO public.authenticator_config_entry VALUES ('21ba4fe9-7204-4524-b1b5-6d1e60493604', 'false', 'require.password.update.after.registration');
INSERT INTO public.authenticator_config_entry VALUES ('6aacc659-dbda-45c8-a58c-31922d242e8f', 'webauthn-passwordless', 'credentials');
INSERT INTO public.authenticator_config_entry VALUES ('f156e486-1a60-48ae-9ec9-92b68f943b6f', 'missing', 'update.profile.on.first.login');
INSERT INTO public.authenticator_config_entry VALUES ('2d96bd2a-7e11-4a6c-b20b-1244c99a9b01', 'webauthn-passwordless', 'credentials');
INSERT INTO public.authenticator_config_entry VALUES ('7293b199-3657-4d53-b049-6104c58f5aa9', 'webauthn-passwordless', 'credentials');
INSERT INTO public.authenticator_config_entry VALUES ('7a91b663-1e20-45df-a888-4ff924bac407', 'missing', 'update.profile.on.first.login');
INSERT INTO public.authenticator_config_entry VALUES ('d8629046-b03c-423b-803e-9a3c2a687f33', 'false', 'require.password.update.after.registration');


--
-- TOC entry 4217 (class 0 OID 16413)
-- Dependencies: 220
-- Data for Name: broker_link; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4218 (class 0 OID 16418)
-- Dependencies: 221
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.client VALUES ('fc8ba69a-482f-4900-90ad-721fe89f195f', true, false, 'master-realm', 0, false, NULL, NULL, true, NULL, false, '0666ea4e-c88f-4e30-bf74-4874c0b2484d', NULL, 0, false, false, 'master Realm', false, 'client-secret', NULL, NULL, NULL, true, false, false, false);
INSERT INTO public.client VALUES ('0b148250-d1c8-45d5-836c-b324e24f2f58', true, false, 'account', 0, true, NULL, '/realms/master/account/', false, NULL, false, '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'openid-connect', 0, false, false, '${client_account}', false, 'client-secret', '${authBaseUrl}', NULL, NULL, true, false, false, false);
INSERT INTO public.client VALUES ('5e3fa378-9c17-4fea-a010-658a9422c2c9', true, false, 'account-console', 0, true, NULL, '/realms/master/account/', false, NULL, false, '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'openid-connect', 0, false, false, '${client_account-console}', false, 'client-secret', '${authBaseUrl}', NULL, NULL, true, false, false, false);
INSERT INTO public.client VALUES ('855e27ee-2639-4633-9417-1649ff1d8ab7', true, false, 'broker', 0, false, NULL, NULL, true, NULL, false, '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'openid-connect', 0, false, false, '${client_broker}', false, 'client-secret', NULL, NULL, NULL, true, false, false, false);
INSERT INTO public.client VALUES ('46c97fed-5865-497a-90cc-eeb6a263032a', true, true, 'security-admin-console', 0, true, NULL, '/admin/master/console/', false, NULL, false, '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'openid-connect', 0, false, false, '${client_security-admin-console}', false, 'client-secret', '${authAdminUrl}', NULL, NULL, true, false, false, false);
INSERT INTO public.client VALUES ('7e653431-7cac-4f92-a23e-fb8a903bfa4b', true, true, 'admin-cli', 0, true, NULL, NULL, false, NULL, false, '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'openid-connect', 0, false, false, '${client_admin-cli}', false, 'client-secret', NULL, NULL, NULL, false, false, true, false);
INSERT INTO public.client VALUES ('d6950149-318e-4aa6-b269-0054a67501d6', true, false, 'alumnet-realm-realm', 0, false, NULL, NULL, true, NULL, false, '0666ea4e-c88f-4e30-bf74-4874c0b2484d', NULL, 0, false, false, 'alumnet-realm Realm', false, 'client-secret', NULL, NULL, NULL, true, false, false, false);
INSERT INTO public.client VALUES ('7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', true, false, 'realm-management', 0, false, NULL, NULL, true, NULL, false, '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'openid-connect', 0, false, false, '${client_realm-management}', false, 'client-secret', NULL, NULL, NULL, true, false, false, false);
INSERT INTO public.client VALUES ('09f537ab-f042-4fdc-90e5-93431b52d758', true, false, 'account', 0, true, NULL, '/realms/alumnet-realm/account/', false, NULL, false, '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'openid-connect', 0, false, false, '${client_account}', false, 'client-secret', '${authBaseUrl}', NULL, NULL, true, false, false, false);
INSERT INTO public.client VALUES ('0755204d-499f-4aa8-9844-73c138cd6e72', true, false, 'account-console', 0, true, NULL, '/realms/alumnet-realm/account/', false, NULL, false, '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'openid-connect', 0, false, false, '${client_account-console}', false, 'client-secret', '${authBaseUrl}', NULL, NULL, true, false, false, false);
INSERT INTO public.client VALUES ('00f02027-97d5-4940-9702-167480c7a369', true, false, 'broker', 0, false, NULL, NULL, true, NULL, false, '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'openid-connect', 0, false, false, '${client_broker}', false, 'client-secret', NULL, NULL, NULL, true, false, false, false);
INSERT INTO public.client VALUES ('f386953e-2fb0-4093-b0a6-bc07803ce34e', true, true, 'security-admin-console', 0, true, NULL, '/admin/alumnet-realm/console/', false, NULL, false, '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'openid-connect', 0, false, false, '${client_security-admin-console}', false, 'client-secret', '${authAdminUrl}', NULL, NULL, true, false, false, false);
INSERT INTO public.client VALUES ('1a31b1fd-ab20-4aac-adc8-622b23f431e6', true, true, 'admin-cli', 0, true, NULL, NULL, false, NULL, false, '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'openid-connect', 0, false, false, '${client_admin-cli}', false, 'client-secret', NULL, NULL, NULL, false, false, true, false);
INSERT INTO public.client VALUES ('a17e62f0-27d3-4e2f-9362-451b9cc24dc3', true, true, 'alumnet', 0, true, NULL, '', false, '', false, '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'openid-connect', -1, true, false, 'alumnet', false, 'client-secret', '', '', NULL, true, false, true, false);
INSERT INTO public.client VALUES ('b9a6b3be-9f94-4272-8e8e-a71b8b9050bb', true, true, 'alum-net', 0, false, 'ijFpRq7suAnWIGpZHxDvREvbBT4ByiWZ', '', false, '', false, '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'openid-connect', -1, true, false, '', false, 'client-secret', '', '', NULL, true, true, true, true);


--
-- TOC entry 4219 (class 0 OID 16436)
-- Dependencies: 222
-- Data for Name: client_attributes; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.client_attributes VALUES ('0b148250-d1c8-45d5-836c-b324e24f2f58', 'post.logout.redirect.uris', '+');
INSERT INTO public.client_attributes VALUES ('5e3fa378-9c17-4fea-a010-658a9422c2c9', 'post.logout.redirect.uris', '+');
INSERT INTO public.client_attributes VALUES ('5e3fa378-9c17-4fea-a010-658a9422c2c9', 'pkce.code.challenge.method', 'S256');
INSERT INTO public.client_attributes VALUES ('46c97fed-5865-497a-90cc-eeb6a263032a', 'post.logout.redirect.uris', '+');
INSERT INTO public.client_attributes VALUES ('46c97fed-5865-497a-90cc-eeb6a263032a', 'pkce.code.challenge.method', 'S256');
INSERT INTO public.client_attributes VALUES ('46c97fed-5865-497a-90cc-eeb6a263032a', 'client.use.lightweight.access.token.enabled', 'true');
INSERT INTO public.client_attributes VALUES ('7e653431-7cac-4f92-a23e-fb8a903bfa4b', 'client.use.lightweight.access.token.enabled', 'true');
INSERT INTO public.client_attributes VALUES ('09f537ab-f042-4fdc-90e5-93431b52d758', 'post.logout.redirect.uris', '+');
INSERT INTO public.client_attributes VALUES ('0755204d-499f-4aa8-9844-73c138cd6e72', 'post.logout.redirect.uris', '+');
INSERT INTO public.client_attributes VALUES ('0755204d-499f-4aa8-9844-73c138cd6e72', 'pkce.code.challenge.method', 'S256');
INSERT INTO public.client_attributes VALUES ('f386953e-2fb0-4093-b0a6-bc07803ce34e', 'post.logout.redirect.uris', '+');
INSERT INTO public.client_attributes VALUES ('f386953e-2fb0-4093-b0a6-bc07803ce34e', 'pkce.code.challenge.method', 'S256');
INSERT INTO public.client_attributes VALUES ('f386953e-2fb0-4093-b0a6-bc07803ce34e', 'client.use.lightweight.access.token.enabled', 'true');
INSERT INTO public.client_attributes VALUES ('1a31b1fd-ab20-4aac-adc8-622b23f431e6', 'client.use.lightweight.access.token.enabled', 'true');
INSERT INTO public.client_attributes VALUES ('a17e62f0-27d3-4e2f-9362-451b9cc24dc3', 'standard.token.exchange.enabled', 'false');
INSERT INTO public.client_attributes VALUES ('a17e62f0-27d3-4e2f-9362-451b9cc24dc3', 'oauth2.device.authorization.grant.enabled', 'false');
INSERT INTO public.client_attributes VALUES ('a17e62f0-27d3-4e2f-9362-451b9cc24dc3', 'oidc.ciba.grant.enabled', 'false');
INSERT INTO public.client_attributes VALUES ('a17e62f0-27d3-4e2f-9362-451b9cc24dc3', 'dpop.bound.access.tokens', 'false');
INSERT INTO public.client_attributes VALUES ('a17e62f0-27d3-4e2f-9362-451b9cc24dc3', 'backchannel.logout.session.required', 'true');
INSERT INTO public.client_attributes VALUES ('a17e62f0-27d3-4e2f-9362-451b9cc24dc3', 'backchannel.logout.revoke.offline.tokens', 'false');
INSERT INTO public.client_attributes VALUES ('b9a6b3be-9f94-4272-8e8e-a71b8b9050bb', 'client.secret.creation.time', '1760569235');
INSERT INTO public.client_attributes VALUES ('b9a6b3be-9f94-4272-8e8e-a71b8b9050bb', 'standard.token.exchange.enabled', 'false');
INSERT INTO public.client_attributes VALUES ('b9a6b3be-9f94-4272-8e8e-a71b8b9050bb', 'oauth2.device.authorization.grant.enabled', 'false');
INSERT INTO public.client_attributes VALUES ('b9a6b3be-9f94-4272-8e8e-a71b8b9050bb', 'oidc.ciba.grant.enabled', 'false');
INSERT INTO public.client_attributes VALUES ('b9a6b3be-9f94-4272-8e8e-a71b8b9050bb', 'dpop.bound.access.tokens', 'false');
INSERT INTO public.client_attributes VALUES ('b9a6b3be-9f94-4272-8e8e-a71b8b9050bb', 'backchannel.logout.session.required', 'true');
INSERT INTO public.client_attributes VALUES ('b9a6b3be-9f94-4272-8e8e-a71b8b9050bb', 'backchannel.logout.revoke.offline.tokens', 'false');


--
-- TOC entry 4220 (class 0 OID 16441)
-- Dependencies: 223
-- Data for Name: client_auth_flow_bindings; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4221 (class 0 OID 16444)
-- Dependencies: 224
-- Data for Name: client_initial_access; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4222 (class 0 OID 16447)
-- Dependencies: 225
-- Data for Name: client_node_registrations; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4223 (class 0 OID 16450)
-- Dependencies: 226
-- Data for Name: client_scope; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.client_scope VALUES ('e0494fe5-b7de-45d8-bb95-af39b1cc1ffc', 'offline_access', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'OpenID Connect built-in scope: offline_access', 'openid-connect');
INSERT INTO public.client_scope VALUES ('58e46e1a-cc0e-4fd2-980a-4c77088f7e35', 'role_list', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'SAML role list', 'saml');
INSERT INTO public.client_scope VALUES ('fd9493c9-59f4-4a84-a97b-9b0b8ecd942f', 'saml_organization', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'Organization Membership', 'saml');
INSERT INTO public.client_scope VALUES ('62575e76-6395-4763-8bef-09e8e8d59993', 'profile', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'OpenID Connect built-in scope: profile', 'openid-connect');
INSERT INTO public.client_scope VALUES ('593c1616-ca62-42db-94eb-f3c5487a52da', 'email', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'OpenID Connect built-in scope: email', 'openid-connect');
INSERT INTO public.client_scope VALUES ('688617ce-f549-4120-a885-33b3dfae6282', 'address', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'OpenID Connect built-in scope: address', 'openid-connect');
INSERT INTO public.client_scope VALUES ('68d40b24-a216-4a20-84b6-81420d7a0c95', 'phone', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'OpenID Connect built-in scope: phone', 'openid-connect');
INSERT INTO public.client_scope VALUES ('c5eed9dc-700f-4362-8804-04f04da04765', 'roles', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'OpenID Connect scope for add user roles to the access token', 'openid-connect');
INSERT INTO public.client_scope VALUES ('62f74fe4-018f-4b9a-bbc3-cfdd9e1fb856', 'web-origins', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'OpenID Connect scope for add allowed web origins to the access token', 'openid-connect');
INSERT INTO public.client_scope VALUES ('96bb40cf-535c-4937-ae0f-0c913bf5952f', 'microprofile-jwt', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'Microprofile - JWT built-in scope', 'openid-connect');
INSERT INTO public.client_scope VALUES ('01a2c8df-abd8-444c-8e7f-61d62c869545', 'acr', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'OpenID Connect scope for add acr (authentication context class reference) to the token', 'openid-connect');
INSERT INTO public.client_scope VALUES ('7e8f2efc-a69f-4c37-940d-aabff960c64b', 'basic', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'OpenID Connect scope for add all basic claims to the token', 'openid-connect');
INSERT INTO public.client_scope VALUES ('f45a6387-28be-4af3-a9b1-19c4b45cb5fa', 'service_account', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'Specific scope for a client enabled for service accounts', 'openid-connect');
INSERT INTO public.client_scope VALUES ('354e93d1-efa3-497f-984f-8d4a0a76c2a6', 'organization', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'Additional claims about the organization a subject belongs to', 'openid-connect');
INSERT INTO public.client_scope VALUES ('f8e4d1e8-7103-4704-97a3-1ee62aa86660', 'offline_access', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'OpenID Connect built-in scope: offline_access', 'openid-connect');
INSERT INTO public.client_scope VALUES ('4dc9be4d-e7bc-48ec-8bd8-d2568f39b002', 'role_list', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'SAML role list', 'saml');
INSERT INTO public.client_scope VALUES ('ee632a6d-6ac6-47d5-8230-999b1a477a3a', 'saml_organization', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'Organization Membership', 'saml');
INSERT INTO public.client_scope VALUES ('ac19754b-388f-4693-98be-d848d089fd01', 'profile', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'OpenID Connect built-in scope: profile', 'openid-connect');
INSERT INTO public.client_scope VALUES ('a1fff042-318c-4d6e-9aa1-c8c20bd59868', 'email', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'OpenID Connect built-in scope: email', 'openid-connect');
INSERT INTO public.client_scope VALUES ('7b1c264b-9d0c-4b3b-b16e-69fc224d9f7f', 'address', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'OpenID Connect built-in scope: address', 'openid-connect');
INSERT INTO public.client_scope VALUES ('18650c31-3ce4-4b1e-8f73-875ae273569d', 'phone', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'OpenID Connect built-in scope: phone', 'openid-connect');
INSERT INTO public.client_scope VALUES ('a8acc800-a1e6-442a-b50f-b4a7d4b72fb5', 'roles', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'OpenID Connect scope for add user roles to the access token', 'openid-connect');
INSERT INTO public.client_scope VALUES ('bf3b4f1d-f637-4455-ace8-25e492d59f36', 'web-origins', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'OpenID Connect scope for add allowed web origins to the access token', 'openid-connect');
INSERT INTO public.client_scope VALUES ('748440bd-2511-49b1-911a-d7358db20a62', 'microprofile-jwt', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'Microprofile - JWT built-in scope', 'openid-connect');
INSERT INTO public.client_scope VALUES ('b7a462eb-095f-4d94-b789-fe46b3c02b37', 'acr', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'OpenID Connect scope for add acr (authentication context class reference) to the token', 'openid-connect');
INSERT INTO public.client_scope VALUES ('a63914be-3f59-4780-98f4-ed55a3bb4d1e', 'basic', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'OpenID Connect scope for add all basic claims to the token', 'openid-connect');
INSERT INTO public.client_scope VALUES ('9328cd16-48bc-4c91-93ad-a9366688d6e8', 'service_account', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'Specific scope for a client enabled for service accounts', 'openid-connect');
INSERT INTO public.client_scope VALUES ('0f21e46c-0abc-44e7-b9c5-2da49b32e298', 'organization', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'Additional claims about the organization a subject belongs to', 'openid-connect');


--
-- TOC entry 4224 (class 0 OID 16455)
-- Dependencies: 227
-- Data for Name: client_scope_attributes; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.client_scope_attributes VALUES ('e0494fe5-b7de-45d8-bb95-af39b1cc1ffc', 'true', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('e0494fe5-b7de-45d8-bb95-af39b1cc1ffc', '${offlineAccessScopeConsentText}', 'consent.screen.text');
INSERT INTO public.client_scope_attributes VALUES ('58e46e1a-cc0e-4fd2-980a-4c77088f7e35', 'true', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('58e46e1a-cc0e-4fd2-980a-4c77088f7e35', '${samlRoleListScopeConsentText}', 'consent.screen.text');
INSERT INTO public.client_scope_attributes VALUES ('fd9493c9-59f4-4a84-a97b-9b0b8ecd942f', 'false', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('62575e76-6395-4763-8bef-09e8e8d59993', 'true', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('62575e76-6395-4763-8bef-09e8e8d59993', '${profileScopeConsentText}', 'consent.screen.text');
INSERT INTO public.client_scope_attributes VALUES ('62575e76-6395-4763-8bef-09e8e8d59993', 'true', 'include.in.token.scope');
INSERT INTO public.client_scope_attributes VALUES ('593c1616-ca62-42db-94eb-f3c5487a52da', 'true', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('593c1616-ca62-42db-94eb-f3c5487a52da', '${emailScopeConsentText}', 'consent.screen.text');
INSERT INTO public.client_scope_attributes VALUES ('593c1616-ca62-42db-94eb-f3c5487a52da', 'true', 'include.in.token.scope');
INSERT INTO public.client_scope_attributes VALUES ('688617ce-f549-4120-a885-33b3dfae6282', 'true', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('688617ce-f549-4120-a885-33b3dfae6282', '${addressScopeConsentText}', 'consent.screen.text');
INSERT INTO public.client_scope_attributes VALUES ('688617ce-f549-4120-a885-33b3dfae6282', 'true', 'include.in.token.scope');
INSERT INTO public.client_scope_attributes VALUES ('68d40b24-a216-4a20-84b6-81420d7a0c95', 'true', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('68d40b24-a216-4a20-84b6-81420d7a0c95', '${phoneScopeConsentText}', 'consent.screen.text');
INSERT INTO public.client_scope_attributes VALUES ('68d40b24-a216-4a20-84b6-81420d7a0c95', 'true', 'include.in.token.scope');
INSERT INTO public.client_scope_attributes VALUES ('c5eed9dc-700f-4362-8804-04f04da04765', 'true', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('c5eed9dc-700f-4362-8804-04f04da04765', '${rolesScopeConsentText}', 'consent.screen.text');
INSERT INTO public.client_scope_attributes VALUES ('c5eed9dc-700f-4362-8804-04f04da04765', 'false', 'include.in.token.scope');
INSERT INTO public.client_scope_attributes VALUES ('62f74fe4-018f-4b9a-bbc3-cfdd9e1fb856', 'false', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('62f74fe4-018f-4b9a-bbc3-cfdd9e1fb856', '', 'consent.screen.text');
INSERT INTO public.client_scope_attributes VALUES ('62f74fe4-018f-4b9a-bbc3-cfdd9e1fb856', 'false', 'include.in.token.scope');
INSERT INTO public.client_scope_attributes VALUES ('96bb40cf-535c-4937-ae0f-0c913bf5952f', 'false', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('96bb40cf-535c-4937-ae0f-0c913bf5952f', 'true', 'include.in.token.scope');
INSERT INTO public.client_scope_attributes VALUES ('01a2c8df-abd8-444c-8e7f-61d62c869545', 'false', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('01a2c8df-abd8-444c-8e7f-61d62c869545', 'false', 'include.in.token.scope');
INSERT INTO public.client_scope_attributes VALUES ('7e8f2efc-a69f-4c37-940d-aabff960c64b', 'false', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('7e8f2efc-a69f-4c37-940d-aabff960c64b', 'false', 'include.in.token.scope');
INSERT INTO public.client_scope_attributes VALUES ('f45a6387-28be-4af3-a9b1-19c4b45cb5fa', 'false', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('f45a6387-28be-4af3-a9b1-19c4b45cb5fa', 'false', 'include.in.token.scope');
INSERT INTO public.client_scope_attributes VALUES ('354e93d1-efa3-497f-984f-8d4a0a76c2a6', 'true', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('354e93d1-efa3-497f-984f-8d4a0a76c2a6', '${organizationScopeConsentText}', 'consent.screen.text');
INSERT INTO public.client_scope_attributes VALUES ('354e93d1-efa3-497f-984f-8d4a0a76c2a6', 'true', 'include.in.token.scope');
INSERT INTO public.client_scope_attributes VALUES ('f8e4d1e8-7103-4704-97a3-1ee62aa86660', 'true', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('f8e4d1e8-7103-4704-97a3-1ee62aa86660', '${offlineAccessScopeConsentText}', 'consent.screen.text');
INSERT INTO public.client_scope_attributes VALUES ('4dc9be4d-e7bc-48ec-8bd8-d2568f39b002', 'true', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('4dc9be4d-e7bc-48ec-8bd8-d2568f39b002', '${samlRoleListScopeConsentText}', 'consent.screen.text');
INSERT INTO public.client_scope_attributes VALUES ('ee632a6d-6ac6-47d5-8230-999b1a477a3a', 'false', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('ac19754b-388f-4693-98be-d848d089fd01', 'true', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('ac19754b-388f-4693-98be-d848d089fd01', '${profileScopeConsentText}', 'consent.screen.text');
INSERT INTO public.client_scope_attributes VALUES ('ac19754b-388f-4693-98be-d848d089fd01', 'true', 'include.in.token.scope');
INSERT INTO public.client_scope_attributes VALUES ('a1fff042-318c-4d6e-9aa1-c8c20bd59868', 'true', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('a1fff042-318c-4d6e-9aa1-c8c20bd59868', '${emailScopeConsentText}', 'consent.screen.text');
INSERT INTO public.client_scope_attributes VALUES ('a1fff042-318c-4d6e-9aa1-c8c20bd59868', 'true', 'include.in.token.scope');
INSERT INTO public.client_scope_attributes VALUES ('7b1c264b-9d0c-4b3b-b16e-69fc224d9f7f', 'true', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('7b1c264b-9d0c-4b3b-b16e-69fc224d9f7f', '${addressScopeConsentText}', 'consent.screen.text');
INSERT INTO public.client_scope_attributes VALUES ('7b1c264b-9d0c-4b3b-b16e-69fc224d9f7f', 'true', 'include.in.token.scope');
INSERT INTO public.client_scope_attributes VALUES ('18650c31-3ce4-4b1e-8f73-875ae273569d', 'true', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('18650c31-3ce4-4b1e-8f73-875ae273569d', '${phoneScopeConsentText}', 'consent.screen.text');
INSERT INTO public.client_scope_attributes VALUES ('18650c31-3ce4-4b1e-8f73-875ae273569d', 'true', 'include.in.token.scope');
INSERT INTO public.client_scope_attributes VALUES ('a8acc800-a1e6-442a-b50f-b4a7d4b72fb5', 'true', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('a8acc800-a1e6-442a-b50f-b4a7d4b72fb5', '${rolesScopeConsentText}', 'consent.screen.text');
INSERT INTO public.client_scope_attributes VALUES ('a8acc800-a1e6-442a-b50f-b4a7d4b72fb5', 'false', 'include.in.token.scope');
INSERT INTO public.client_scope_attributes VALUES ('bf3b4f1d-f637-4455-ace8-25e492d59f36', 'false', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('bf3b4f1d-f637-4455-ace8-25e492d59f36', '', 'consent.screen.text');
INSERT INTO public.client_scope_attributes VALUES ('bf3b4f1d-f637-4455-ace8-25e492d59f36', 'false', 'include.in.token.scope');
INSERT INTO public.client_scope_attributes VALUES ('748440bd-2511-49b1-911a-d7358db20a62', 'false', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('748440bd-2511-49b1-911a-d7358db20a62', 'true', 'include.in.token.scope');
INSERT INTO public.client_scope_attributes VALUES ('b7a462eb-095f-4d94-b789-fe46b3c02b37', 'false', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('b7a462eb-095f-4d94-b789-fe46b3c02b37', 'false', 'include.in.token.scope');
INSERT INTO public.client_scope_attributes VALUES ('a63914be-3f59-4780-98f4-ed55a3bb4d1e', 'false', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('a63914be-3f59-4780-98f4-ed55a3bb4d1e', 'false', 'include.in.token.scope');
INSERT INTO public.client_scope_attributes VALUES ('9328cd16-48bc-4c91-93ad-a9366688d6e8', 'false', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('9328cd16-48bc-4c91-93ad-a9366688d6e8', 'false', 'include.in.token.scope');
INSERT INTO public.client_scope_attributes VALUES ('0f21e46c-0abc-44e7-b9c5-2da49b32e298', 'true', 'display.on.consent.screen');
INSERT INTO public.client_scope_attributes VALUES ('0f21e46c-0abc-44e7-b9c5-2da49b32e298', '${organizationScopeConsentText}', 'consent.screen.text');
INSERT INTO public.client_scope_attributes VALUES ('0f21e46c-0abc-44e7-b9c5-2da49b32e298', 'true', 'include.in.token.scope');


--
-- TOC entry 4225 (class 0 OID 16460)
-- Dependencies: 228
-- Data for Name: client_scope_client; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.client_scope_client VALUES ('0b148250-d1c8-45d5-836c-b324e24f2f58', '62575e76-6395-4763-8bef-09e8e8d59993', true);
INSERT INTO public.client_scope_client VALUES ('0b148250-d1c8-45d5-836c-b324e24f2f58', '62f74fe4-018f-4b9a-bbc3-cfdd9e1fb856', true);
INSERT INTO public.client_scope_client VALUES ('0b148250-d1c8-45d5-836c-b324e24f2f58', '7e8f2efc-a69f-4c37-940d-aabff960c64b', true);
INSERT INTO public.client_scope_client VALUES ('0b148250-d1c8-45d5-836c-b324e24f2f58', '01a2c8df-abd8-444c-8e7f-61d62c869545', true);
INSERT INTO public.client_scope_client VALUES ('0b148250-d1c8-45d5-836c-b324e24f2f58', '593c1616-ca62-42db-94eb-f3c5487a52da', true);
INSERT INTO public.client_scope_client VALUES ('0b148250-d1c8-45d5-836c-b324e24f2f58', 'c5eed9dc-700f-4362-8804-04f04da04765', true);
INSERT INTO public.client_scope_client VALUES ('0b148250-d1c8-45d5-836c-b324e24f2f58', 'e0494fe5-b7de-45d8-bb95-af39b1cc1ffc', false);
INSERT INTO public.client_scope_client VALUES ('0b148250-d1c8-45d5-836c-b324e24f2f58', '354e93d1-efa3-497f-984f-8d4a0a76c2a6', false);
INSERT INTO public.client_scope_client VALUES ('0b148250-d1c8-45d5-836c-b324e24f2f58', '96bb40cf-535c-4937-ae0f-0c913bf5952f', false);
INSERT INTO public.client_scope_client VALUES ('0b148250-d1c8-45d5-836c-b324e24f2f58', '688617ce-f549-4120-a885-33b3dfae6282', false);
INSERT INTO public.client_scope_client VALUES ('0b148250-d1c8-45d5-836c-b324e24f2f58', '68d40b24-a216-4a20-84b6-81420d7a0c95', false);
INSERT INTO public.client_scope_client VALUES ('5e3fa378-9c17-4fea-a010-658a9422c2c9', '62575e76-6395-4763-8bef-09e8e8d59993', true);
INSERT INTO public.client_scope_client VALUES ('5e3fa378-9c17-4fea-a010-658a9422c2c9', '62f74fe4-018f-4b9a-bbc3-cfdd9e1fb856', true);
INSERT INTO public.client_scope_client VALUES ('5e3fa378-9c17-4fea-a010-658a9422c2c9', '7e8f2efc-a69f-4c37-940d-aabff960c64b', true);
INSERT INTO public.client_scope_client VALUES ('5e3fa378-9c17-4fea-a010-658a9422c2c9', '01a2c8df-abd8-444c-8e7f-61d62c869545', true);
INSERT INTO public.client_scope_client VALUES ('5e3fa378-9c17-4fea-a010-658a9422c2c9', '593c1616-ca62-42db-94eb-f3c5487a52da', true);
INSERT INTO public.client_scope_client VALUES ('5e3fa378-9c17-4fea-a010-658a9422c2c9', 'c5eed9dc-700f-4362-8804-04f04da04765', true);
INSERT INTO public.client_scope_client VALUES ('5e3fa378-9c17-4fea-a010-658a9422c2c9', 'e0494fe5-b7de-45d8-bb95-af39b1cc1ffc', false);
INSERT INTO public.client_scope_client VALUES ('5e3fa378-9c17-4fea-a010-658a9422c2c9', '354e93d1-efa3-497f-984f-8d4a0a76c2a6', false);
INSERT INTO public.client_scope_client VALUES ('5e3fa378-9c17-4fea-a010-658a9422c2c9', '96bb40cf-535c-4937-ae0f-0c913bf5952f', false);
INSERT INTO public.client_scope_client VALUES ('5e3fa378-9c17-4fea-a010-658a9422c2c9', '688617ce-f549-4120-a885-33b3dfae6282', false);
INSERT INTO public.client_scope_client VALUES ('5e3fa378-9c17-4fea-a010-658a9422c2c9', '68d40b24-a216-4a20-84b6-81420d7a0c95', false);
INSERT INTO public.client_scope_client VALUES ('7e653431-7cac-4f92-a23e-fb8a903bfa4b', '62575e76-6395-4763-8bef-09e8e8d59993', true);
INSERT INTO public.client_scope_client VALUES ('7e653431-7cac-4f92-a23e-fb8a903bfa4b', '62f74fe4-018f-4b9a-bbc3-cfdd9e1fb856', true);
INSERT INTO public.client_scope_client VALUES ('7e653431-7cac-4f92-a23e-fb8a903bfa4b', '7e8f2efc-a69f-4c37-940d-aabff960c64b', true);
INSERT INTO public.client_scope_client VALUES ('7e653431-7cac-4f92-a23e-fb8a903bfa4b', '01a2c8df-abd8-444c-8e7f-61d62c869545', true);
INSERT INTO public.client_scope_client VALUES ('7e653431-7cac-4f92-a23e-fb8a903bfa4b', '593c1616-ca62-42db-94eb-f3c5487a52da', true);
INSERT INTO public.client_scope_client VALUES ('7e653431-7cac-4f92-a23e-fb8a903bfa4b', 'c5eed9dc-700f-4362-8804-04f04da04765', true);
INSERT INTO public.client_scope_client VALUES ('7e653431-7cac-4f92-a23e-fb8a903bfa4b', 'e0494fe5-b7de-45d8-bb95-af39b1cc1ffc', false);
INSERT INTO public.client_scope_client VALUES ('7e653431-7cac-4f92-a23e-fb8a903bfa4b', '354e93d1-efa3-497f-984f-8d4a0a76c2a6', false);
INSERT INTO public.client_scope_client VALUES ('7e653431-7cac-4f92-a23e-fb8a903bfa4b', '96bb40cf-535c-4937-ae0f-0c913bf5952f', false);
INSERT INTO public.client_scope_client VALUES ('7e653431-7cac-4f92-a23e-fb8a903bfa4b', '688617ce-f549-4120-a885-33b3dfae6282', false);
INSERT INTO public.client_scope_client VALUES ('7e653431-7cac-4f92-a23e-fb8a903bfa4b', '68d40b24-a216-4a20-84b6-81420d7a0c95', false);
INSERT INTO public.client_scope_client VALUES ('855e27ee-2639-4633-9417-1649ff1d8ab7', '62575e76-6395-4763-8bef-09e8e8d59993', true);
INSERT INTO public.client_scope_client VALUES ('855e27ee-2639-4633-9417-1649ff1d8ab7', '62f74fe4-018f-4b9a-bbc3-cfdd9e1fb856', true);
INSERT INTO public.client_scope_client VALUES ('855e27ee-2639-4633-9417-1649ff1d8ab7', '7e8f2efc-a69f-4c37-940d-aabff960c64b', true);
INSERT INTO public.client_scope_client VALUES ('855e27ee-2639-4633-9417-1649ff1d8ab7', '01a2c8df-abd8-444c-8e7f-61d62c869545', true);
INSERT INTO public.client_scope_client VALUES ('855e27ee-2639-4633-9417-1649ff1d8ab7', '593c1616-ca62-42db-94eb-f3c5487a52da', true);
INSERT INTO public.client_scope_client VALUES ('855e27ee-2639-4633-9417-1649ff1d8ab7', 'c5eed9dc-700f-4362-8804-04f04da04765', true);
INSERT INTO public.client_scope_client VALUES ('855e27ee-2639-4633-9417-1649ff1d8ab7', 'e0494fe5-b7de-45d8-bb95-af39b1cc1ffc', false);
INSERT INTO public.client_scope_client VALUES ('855e27ee-2639-4633-9417-1649ff1d8ab7', '354e93d1-efa3-497f-984f-8d4a0a76c2a6', false);
INSERT INTO public.client_scope_client VALUES ('855e27ee-2639-4633-9417-1649ff1d8ab7', '96bb40cf-535c-4937-ae0f-0c913bf5952f', false);
INSERT INTO public.client_scope_client VALUES ('855e27ee-2639-4633-9417-1649ff1d8ab7', '688617ce-f549-4120-a885-33b3dfae6282', false);
INSERT INTO public.client_scope_client VALUES ('855e27ee-2639-4633-9417-1649ff1d8ab7', '68d40b24-a216-4a20-84b6-81420d7a0c95', false);
INSERT INTO public.client_scope_client VALUES ('fc8ba69a-482f-4900-90ad-721fe89f195f', '62575e76-6395-4763-8bef-09e8e8d59993', true);
INSERT INTO public.client_scope_client VALUES ('fc8ba69a-482f-4900-90ad-721fe89f195f', '62f74fe4-018f-4b9a-bbc3-cfdd9e1fb856', true);
INSERT INTO public.client_scope_client VALUES ('fc8ba69a-482f-4900-90ad-721fe89f195f', '7e8f2efc-a69f-4c37-940d-aabff960c64b', true);
INSERT INTO public.client_scope_client VALUES ('fc8ba69a-482f-4900-90ad-721fe89f195f', '01a2c8df-abd8-444c-8e7f-61d62c869545', true);
INSERT INTO public.client_scope_client VALUES ('fc8ba69a-482f-4900-90ad-721fe89f195f', '593c1616-ca62-42db-94eb-f3c5487a52da', true);
INSERT INTO public.client_scope_client VALUES ('fc8ba69a-482f-4900-90ad-721fe89f195f', 'c5eed9dc-700f-4362-8804-04f04da04765', true);
INSERT INTO public.client_scope_client VALUES ('fc8ba69a-482f-4900-90ad-721fe89f195f', 'e0494fe5-b7de-45d8-bb95-af39b1cc1ffc', false);
INSERT INTO public.client_scope_client VALUES ('fc8ba69a-482f-4900-90ad-721fe89f195f', '354e93d1-efa3-497f-984f-8d4a0a76c2a6', false);
INSERT INTO public.client_scope_client VALUES ('fc8ba69a-482f-4900-90ad-721fe89f195f', '96bb40cf-535c-4937-ae0f-0c913bf5952f', false);
INSERT INTO public.client_scope_client VALUES ('fc8ba69a-482f-4900-90ad-721fe89f195f', '688617ce-f549-4120-a885-33b3dfae6282', false);
INSERT INTO public.client_scope_client VALUES ('fc8ba69a-482f-4900-90ad-721fe89f195f', '68d40b24-a216-4a20-84b6-81420d7a0c95', false);
INSERT INTO public.client_scope_client VALUES ('46c97fed-5865-497a-90cc-eeb6a263032a', '62575e76-6395-4763-8bef-09e8e8d59993', true);
INSERT INTO public.client_scope_client VALUES ('46c97fed-5865-497a-90cc-eeb6a263032a', '62f74fe4-018f-4b9a-bbc3-cfdd9e1fb856', true);
INSERT INTO public.client_scope_client VALUES ('46c97fed-5865-497a-90cc-eeb6a263032a', '7e8f2efc-a69f-4c37-940d-aabff960c64b', true);
INSERT INTO public.client_scope_client VALUES ('46c97fed-5865-497a-90cc-eeb6a263032a', '01a2c8df-abd8-444c-8e7f-61d62c869545', true);
INSERT INTO public.client_scope_client VALUES ('46c97fed-5865-497a-90cc-eeb6a263032a', '593c1616-ca62-42db-94eb-f3c5487a52da', true);
INSERT INTO public.client_scope_client VALUES ('46c97fed-5865-497a-90cc-eeb6a263032a', 'c5eed9dc-700f-4362-8804-04f04da04765', true);
INSERT INTO public.client_scope_client VALUES ('46c97fed-5865-497a-90cc-eeb6a263032a', 'e0494fe5-b7de-45d8-bb95-af39b1cc1ffc', false);
INSERT INTO public.client_scope_client VALUES ('46c97fed-5865-497a-90cc-eeb6a263032a', '354e93d1-efa3-497f-984f-8d4a0a76c2a6', false);
INSERT INTO public.client_scope_client VALUES ('46c97fed-5865-497a-90cc-eeb6a263032a', '96bb40cf-535c-4937-ae0f-0c913bf5952f', false);
INSERT INTO public.client_scope_client VALUES ('46c97fed-5865-497a-90cc-eeb6a263032a', '688617ce-f549-4120-a885-33b3dfae6282', false);
INSERT INTO public.client_scope_client VALUES ('46c97fed-5865-497a-90cc-eeb6a263032a', '68d40b24-a216-4a20-84b6-81420d7a0c95', false);
INSERT INTO public.client_scope_client VALUES ('09f537ab-f042-4fdc-90e5-93431b52d758', 'a1fff042-318c-4d6e-9aa1-c8c20bd59868', true);
INSERT INTO public.client_scope_client VALUES ('09f537ab-f042-4fdc-90e5-93431b52d758', 'ac19754b-388f-4693-98be-d848d089fd01', true);
INSERT INTO public.client_scope_client VALUES ('09f537ab-f042-4fdc-90e5-93431b52d758', 'a63914be-3f59-4780-98f4-ed55a3bb4d1e', true);
INSERT INTO public.client_scope_client VALUES ('09f537ab-f042-4fdc-90e5-93431b52d758', 'b7a462eb-095f-4d94-b789-fe46b3c02b37', true);
INSERT INTO public.client_scope_client VALUES ('09f537ab-f042-4fdc-90e5-93431b52d758', 'a8acc800-a1e6-442a-b50f-b4a7d4b72fb5', true);
INSERT INTO public.client_scope_client VALUES ('09f537ab-f042-4fdc-90e5-93431b52d758', 'bf3b4f1d-f637-4455-ace8-25e492d59f36', true);
INSERT INTO public.client_scope_client VALUES ('09f537ab-f042-4fdc-90e5-93431b52d758', 'f8e4d1e8-7103-4704-97a3-1ee62aa86660', false);
INSERT INTO public.client_scope_client VALUES ('09f537ab-f042-4fdc-90e5-93431b52d758', '0f21e46c-0abc-44e7-b9c5-2da49b32e298', false);
INSERT INTO public.client_scope_client VALUES ('09f537ab-f042-4fdc-90e5-93431b52d758', '748440bd-2511-49b1-911a-d7358db20a62', false);
INSERT INTO public.client_scope_client VALUES ('09f537ab-f042-4fdc-90e5-93431b52d758', '7b1c264b-9d0c-4b3b-b16e-69fc224d9f7f', false);
INSERT INTO public.client_scope_client VALUES ('09f537ab-f042-4fdc-90e5-93431b52d758', '18650c31-3ce4-4b1e-8f73-875ae273569d', false);
INSERT INTO public.client_scope_client VALUES ('0755204d-499f-4aa8-9844-73c138cd6e72', 'a1fff042-318c-4d6e-9aa1-c8c20bd59868', true);
INSERT INTO public.client_scope_client VALUES ('0755204d-499f-4aa8-9844-73c138cd6e72', 'ac19754b-388f-4693-98be-d848d089fd01', true);
INSERT INTO public.client_scope_client VALUES ('0755204d-499f-4aa8-9844-73c138cd6e72', 'a63914be-3f59-4780-98f4-ed55a3bb4d1e', true);
INSERT INTO public.client_scope_client VALUES ('0755204d-499f-4aa8-9844-73c138cd6e72', 'b7a462eb-095f-4d94-b789-fe46b3c02b37', true);
INSERT INTO public.client_scope_client VALUES ('0755204d-499f-4aa8-9844-73c138cd6e72', 'a8acc800-a1e6-442a-b50f-b4a7d4b72fb5', true);
INSERT INTO public.client_scope_client VALUES ('0755204d-499f-4aa8-9844-73c138cd6e72', 'bf3b4f1d-f637-4455-ace8-25e492d59f36', true);
INSERT INTO public.client_scope_client VALUES ('0755204d-499f-4aa8-9844-73c138cd6e72', 'f8e4d1e8-7103-4704-97a3-1ee62aa86660', false);
INSERT INTO public.client_scope_client VALUES ('0755204d-499f-4aa8-9844-73c138cd6e72', '0f21e46c-0abc-44e7-b9c5-2da49b32e298', false);
INSERT INTO public.client_scope_client VALUES ('0755204d-499f-4aa8-9844-73c138cd6e72', '748440bd-2511-49b1-911a-d7358db20a62', false);
INSERT INTO public.client_scope_client VALUES ('0755204d-499f-4aa8-9844-73c138cd6e72', '7b1c264b-9d0c-4b3b-b16e-69fc224d9f7f', false);
INSERT INTO public.client_scope_client VALUES ('0755204d-499f-4aa8-9844-73c138cd6e72', '18650c31-3ce4-4b1e-8f73-875ae273569d', false);
INSERT INTO public.client_scope_client VALUES ('1a31b1fd-ab20-4aac-adc8-622b23f431e6', 'a1fff042-318c-4d6e-9aa1-c8c20bd59868', true);
INSERT INTO public.client_scope_client VALUES ('1a31b1fd-ab20-4aac-adc8-622b23f431e6', 'ac19754b-388f-4693-98be-d848d089fd01', true);
INSERT INTO public.client_scope_client VALUES ('1a31b1fd-ab20-4aac-adc8-622b23f431e6', 'a63914be-3f59-4780-98f4-ed55a3bb4d1e', true);
INSERT INTO public.client_scope_client VALUES ('1a31b1fd-ab20-4aac-adc8-622b23f431e6', 'b7a462eb-095f-4d94-b789-fe46b3c02b37', true);
INSERT INTO public.client_scope_client VALUES ('1a31b1fd-ab20-4aac-adc8-622b23f431e6', 'a8acc800-a1e6-442a-b50f-b4a7d4b72fb5', true);
INSERT INTO public.client_scope_client VALUES ('1a31b1fd-ab20-4aac-adc8-622b23f431e6', 'bf3b4f1d-f637-4455-ace8-25e492d59f36', true);
INSERT INTO public.client_scope_client VALUES ('1a31b1fd-ab20-4aac-adc8-622b23f431e6', 'f8e4d1e8-7103-4704-97a3-1ee62aa86660', false);
INSERT INTO public.client_scope_client VALUES ('1a31b1fd-ab20-4aac-adc8-622b23f431e6', '0f21e46c-0abc-44e7-b9c5-2da49b32e298', false);
INSERT INTO public.client_scope_client VALUES ('1a31b1fd-ab20-4aac-adc8-622b23f431e6', '748440bd-2511-49b1-911a-d7358db20a62', false);
INSERT INTO public.client_scope_client VALUES ('1a31b1fd-ab20-4aac-adc8-622b23f431e6', '7b1c264b-9d0c-4b3b-b16e-69fc224d9f7f', false);
INSERT INTO public.client_scope_client VALUES ('1a31b1fd-ab20-4aac-adc8-622b23f431e6', '18650c31-3ce4-4b1e-8f73-875ae273569d', false);
INSERT INTO public.client_scope_client VALUES ('00f02027-97d5-4940-9702-167480c7a369', 'a1fff042-318c-4d6e-9aa1-c8c20bd59868', true);
INSERT INTO public.client_scope_client VALUES ('00f02027-97d5-4940-9702-167480c7a369', 'ac19754b-388f-4693-98be-d848d089fd01', true);
INSERT INTO public.client_scope_client VALUES ('00f02027-97d5-4940-9702-167480c7a369', 'a63914be-3f59-4780-98f4-ed55a3bb4d1e', true);
INSERT INTO public.client_scope_client VALUES ('00f02027-97d5-4940-9702-167480c7a369', 'b7a462eb-095f-4d94-b789-fe46b3c02b37', true);
INSERT INTO public.client_scope_client VALUES ('00f02027-97d5-4940-9702-167480c7a369', 'a8acc800-a1e6-442a-b50f-b4a7d4b72fb5', true);
INSERT INTO public.client_scope_client VALUES ('00f02027-97d5-4940-9702-167480c7a369', 'bf3b4f1d-f637-4455-ace8-25e492d59f36', true);
INSERT INTO public.client_scope_client VALUES ('00f02027-97d5-4940-9702-167480c7a369', 'f8e4d1e8-7103-4704-97a3-1ee62aa86660', false);
INSERT INTO public.client_scope_client VALUES ('00f02027-97d5-4940-9702-167480c7a369', '0f21e46c-0abc-44e7-b9c5-2da49b32e298', false);
INSERT INTO public.client_scope_client VALUES ('00f02027-97d5-4940-9702-167480c7a369', '748440bd-2511-49b1-911a-d7358db20a62', false);
INSERT INTO public.client_scope_client VALUES ('00f02027-97d5-4940-9702-167480c7a369', '7b1c264b-9d0c-4b3b-b16e-69fc224d9f7f', false);
INSERT INTO public.client_scope_client VALUES ('00f02027-97d5-4940-9702-167480c7a369', '18650c31-3ce4-4b1e-8f73-875ae273569d', false);
INSERT INTO public.client_scope_client VALUES ('7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', 'a1fff042-318c-4d6e-9aa1-c8c20bd59868', true);
INSERT INTO public.client_scope_client VALUES ('7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', 'ac19754b-388f-4693-98be-d848d089fd01', true);
INSERT INTO public.client_scope_client VALUES ('7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', 'a63914be-3f59-4780-98f4-ed55a3bb4d1e', true);
INSERT INTO public.client_scope_client VALUES ('7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', 'b7a462eb-095f-4d94-b789-fe46b3c02b37', true);
INSERT INTO public.client_scope_client VALUES ('7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', 'a8acc800-a1e6-442a-b50f-b4a7d4b72fb5', true);
INSERT INTO public.client_scope_client VALUES ('7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', 'bf3b4f1d-f637-4455-ace8-25e492d59f36', true);
INSERT INTO public.client_scope_client VALUES ('7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', 'f8e4d1e8-7103-4704-97a3-1ee62aa86660', false);
INSERT INTO public.client_scope_client VALUES ('7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', '0f21e46c-0abc-44e7-b9c5-2da49b32e298', false);
INSERT INTO public.client_scope_client VALUES ('7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', '748440bd-2511-49b1-911a-d7358db20a62', false);
INSERT INTO public.client_scope_client VALUES ('7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', '7b1c264b-9d0c-4b3b-b16e-69fc224d9f7f', false);
INSERT INTO public.client_scope_client VALUES ('7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', '18650c31-3ce4-4b1e-8f73-875ae273569d', false);
INSERT INTO public.client_scope_client VALUES ('f386953e-2fb0-4093-b0a6-bc07803ce34e', 'a1fff042-318c-4d6e-9aa1-c8c20bd59868', true);
INSERT INTO public.client_scope_client VALUES ('f386953e-2fb0-4093-b0a6-bc07803ce34e', 'ac19754b-388f-4693-98be-d848d089fd01', true);
INSERT INTO public.client_scope_client VALUES ('f386953e-2fb0-4093-b0a6-bc07803ce34e', 'a63914be-3f59-4780-98f4-ed55a3bb4d1e', true);
INSERT INTO public.client_scope_client VALUES ('f386953e-2fb0-4093-b0a6-bc07803ce34e', 'b7a462eb-095f-4d94-b789-fe46b3c02b37', true);
INSERT INTO public.client_scope_client VALUES ('f386953e-2fb0-4093-b0a6-bc07803ce34e', 'a8acc800-a1e6-442a-b50f-b4a7d4b72fb5', true);
INSERT INTO public.client_scope_client VALUES ('f386953e-2fb0-4093-b0a6-bc07803ce34e', 'bf3b4f1d-f637-4455-ace8-25e492d59f36', true);
INSERT INTO public.client_scope_client VALUES ('f386953e-2fb0-4093-b0a6-bc07803ce34e', 'f8e4d1e8-7103-4704-97a3-1ee62aa86660', false);
INSERT INTO public.client_scope_client VALUES ('f386953e-2fb0-4093-b0a6-bc07803ce34e', '0f21e46c-0abc-44e7-b9c5-2da49b32e298', false);
INSERT INTO public.client_scope_client VALUES ('f386953e-2fb0-4093-b0a6-bc07803ce34e', '748440bd-2511-49b1-911a-d7358db20a62', false);
INSERT INTO public.client_scope_client VALUES ('f386953e-2fb0-4093-b0a6-bc07803ce34e', '7b1c264b-9d0c-4b3b-b16e-69fc224d9f7f', false);
INSERT INTO public.client_scope_client VALUES ('f386953e-2fb0-4093-b0a6-bc07803ce34e', '18650c31-3ce4-4b1e-8f73-875ae273569d', false);
INSERT INTO public.client_scope_client VALUES ('a17e62f0-27d3-4e2f-9362-451b9cc24dc3', 'a1fff042-318c-4d6e-9aa1-c8c20bd59868', true);
INSERT INTO public.client_scope_client VALUES ('a17e62f0-27d3-4e2f-9362-451b9cc24dc3', 'ac19754b-388f-4693-98be-d848d089fd01', true);
INSERT INTO public.client_scope_client VALUES ('a17e62f0-27d3-4e2f-9362-451b9cc24dc3', 'a63914be-3f59-4780-98f4-ed55a3bb4d1e', true);
INSERT INTO public.client_scope_client VALUES ('a17e62f0-27d3-4e2f-9362-451b9cc24dc3', 'b7a462eb-095f-4d94-b789-fe46b3c02b37', true);
INSERT INTO public.client_scope_client VALUES ('a17e62f0-27d3-4e2f-9362-451b9cc24dc3', 'a8acc800-a1e6-442a-b50f-b4a7d4b72fb5', true);
INSERT INTO public.client_scope_client VALUES ('a17e62f0-27d3-4e2f-9362-451b9cc24dc3', 'bf3b4f1d-f637-4455-ace8-25e492d59f36', true);
INSERT INTO public.client_scope_client VALUES ('a17e62f0-27d3-4e2f-9362-451b9cc24dc3', 'f8e4d1e8-7103-4704-97a3-1ee62aa86660', false);
INSERT INTO public.client_scope_client VALUES ('a17e62f0-27d3-4e2f-9362-451b9cc24dc3', '0f21e46c-0abc-44e7-b9c5-2da49b32e298', false);
INSERT INTO public.client_scope_client VALUES ('a17e62f0-27d3-4e2f-9362-451b9cc24dc3', '748440bd-2511-49b1-911a-d7358db20a62', false);
INSERT INTO public.client_scope_client VALUES ('a17e62f0-27d3-4e2f-9362-451b9cc24dc3', '7b1c264b-9d0c-4b3b-b16e-69fc224d9f7f', false);
INSERT INTO public.client_scope_client VALUES ('a17e62f0-27d3-4e2f-9362-451b9cc24dc3', '18650c31-3ce4-4b1e-8f73-875ae273569d', false);
INSERT INTO public.client_scope_client VALUES ('b9a6b3be-9f94-4272-8e8e-a71b8b9050bb', '62575e76-6395-4763-8bef-09e8e8d59993', true);
INSERT INTO public.client_scope_client VALUES ('b9a6b3be-9f94-4272-8e8e-a71b8b9050bb', '62f74fe4-018f-4b9a-bbc3-cfdd9e1fb856', true);
INSERT INTO public.client_scope_client VALUES ('b9a6b3be-9f94-4272-8e8e-a71b8b9050bb', '7e8f2efc-a69f-4c37-940d-aabff960c64b', true);
INSERT INTO public.client_scope_client VALUES ('b9a6b3be-9f94-4272-8e8e-a71b8b9050bb', '01a2c8df-abd8-444c-8e7f-61d62c869545', true);
INSERT INTO public.client_scope_client VALUES ('b9a6b3be-9f94-4272-8e8e-a71b8b9050bb', '593c1616-ca62-42db-94eb-f3c5487a52da', true);
INSERT INTO public.client_scope_client VALUES ('b9a6b3be-9f94-4272-8e8e-a71b8b9050bb', 'c5eed9dc-700f-4362-8804-04f04da04765', true);
INSERT INTO public.client_scope_client VALUES ('b9a6b3be-9f94-4272-8e8e-a71b8b9050bb', 'e0494fe5-b7de-45d8-bb95-af39b1cc1ffc', false);
INSERT INTO public.client_scope_client VALUES ('b9a6b3be-9f94-4272-8e8e-a71b8b9050bb', '354e93d1-efa3-497f-984f-8d4a0a76c2a6', false);
INSERT INTO public.client_scope_client VALUES ('b9a6b3be-9f94-4272-8e8e-a71b8b9050bb', '96bb40cf-535c-4937-ae0f-0c913bf5952f', false);
INSERT INTO public.client_scope_client VALUES ('b9a6b3be-9f94-4272-8e8e-a71b8b9050bb', '688617ce-f549-4120-a885-33b3dfae6282', false);
INSERT INTO public.client_scope_client VALUES ('b9a6b3be-9f94-4272-8e8e-a71b8b9050bb', '68d40b24-a216-4a20-84b6-81420d7a0c95', false);


--
-- TOC entry 4226 (class 0 OID 16466)
-- Dependencies: 229
-- Data for Name: client_scope_role_mapping; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.client_scope_role_mapping VALUES ('e0494fe5-b7de-45d8-bb95-af39b1cc1ffc', 'a0219b69-16e6-4455-a1ac-f04e2a236a21');
INSERT INTO public.client_scope_role_mapping VALUES ('f8e4d1e8-7103-4704-97a3-1ee62aa86660', '5c4bc45a-6893-4c05-8fdc-3c81acf61bd7');


--
-- TOC entry 4227 (class 0 OID 16469)
-- Dependencies: 230
-- Data for Name: component; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.component VALUES ('2a58c718-b254-498c-8f01-1c6f2edd7531', 'Trusted Hosts', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'trusted-hosts', 'org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'anonymous');
INSERT INTO public.component VALUES ('e6784ab4-d289-44f8-afc9-46f471a69f9a', 'Consent Required', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'consent-required', 'org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'anonymous');
INSERT INTO public.component VALUES ('53917531-1f2a-4f76-8ab7-57bf936b0fc9', 'Full Scope Disabled', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'scope', 'org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'anonymous');
INSERT INTO public.component VALUES ('dba17502-e981-4281-95fd-f586492140dd', 'Max Clients Limit', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'max-clients', 'org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'anonymous');
INSERT INTO public.component VALUES ('aae3ece8-683c-4c97-8859-c55c4a43bdc3', 'Allowed Protocol Mapper Types', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'allowed-protocol-mappers', 'org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'anonymous');
INSERT INTO public.component VALUES ('dbfeec77-ca88-4865-b52a-1e5837667448', 'Allowed Client Scopes', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'allowed-client-templates', 'org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'anonymous');
INSERT INTO public.component VALUES ('a6757934-4a3f-4c1c-b504-30949ce51ba1', 'Allowed Protocol Mapper Types', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'allowed-protocol-mappers', 'org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'authenticated');
INSERT INTO public.component VALUES ('ad6b5481-b53c-4fcf-892c-bce7d141c646', 'Allowed Client Scopes', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'allowed-client-templates', 'org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'authenticated');
INSERT INTO public.component VALUES ('947bc88b-485a-4db1-b24e-b3ef51917ed2', 'rsa-generated', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'rsa-generated', 'org.keycloak.keys.KeyProvider', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', NULL);
INSERT INTO public.component VALUES ('336c9e1d-7fe9-4682-8c09-33d050984ca8', 'rsa-enc-generated', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'rsa-enc-generated', 'org.keycloak.keys.KeyProvider', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', NULL);
INSERT INTO public.component VALUES ('6bbd981a-edd1-43a9-a08f-e30e47090c1c', 'hmac-generated-hs512', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'hmac-generated', 'org.keycloak.keys.KeyProvider', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', NULL);
INSERT INTO public.component VALUES ('892ae70f-9fd7-47b0-9c7c-21247d55fd59', 'aes-generated', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'aes-generated', 'org.keycloak.keys.KeyProvider', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', NULL);
INSERT INTO public.component VALUES ('e3e1e0d5-5f76-4581-83b6-25573587f609', NULL, '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'declarative-user-profile', 'org.keycloak.userprofile.UserProfileProvider', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', NULL);
INSERT INTO public.component VALUES ('d5ffbca9-b26e-4bda-8e7e-ebb67d7898c7', 'rsa-generated', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'rsa-generated', 'org.keycloak.keys.KeyProvider', '000c9ecc-9c3a-44d3-94fe-941ff152490f', NULL);
INSERT INTO public.component VALUES ('ccc9f8d7-d7ca-4429-91df-6ec66dbe8163', 'rsa-enc-generated', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'rsa-enc-generated', 'org.keycloak.keys.KeyProvider', '000c9ecc-9c3a-44d3-94fe-941ff152490f', NULL);
INSERT INTO public.component VALUES ('a2dbd06e-250a-41e1-a046-aad37b093d9e', 'hmac-generated-hs512', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'hmac-generated', 'org.keycloak.keys.KeyProvider', '000c9ecc-9c3a-44d3-94fe-941ff152490f', NULL);
INSERT INTO public.component VALUES ('280cd950-7bf4-4245-bb2d-4357fc3c9cf9', 'aes-generated', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'aes-generated', 'org.keycloak.keys.KeyProvider', '000c9ecc-9c3a-44d3-94fe-941ff152490f', NULL);
INSERT INTO public.component VALUES ('447f4668-bf39-4fe5-9542-fd499d721190', 'Trusted Hosts', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'trusted-hosts', 'org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'anonymous');
INSERT INTO public.component VALUES ('809cf3f3-f23f-4d08-85d3-536be7b0f2ab', 'Consent Required', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'consent-required', 'org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'anonymous');
INSERT INTO public.component VALUES ('bbded862-39d4-4fd0-855b-d646bd5bead7', 'Full Scope Disabled', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'scope', 'org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'anonymous');
INSERT INTO public.component VALUES ('d38dbbdd-ece6-4519-89cd-a4580291b6e2', 'Max Clients Limit', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'max-clients', 'org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'anonymous');
INSERT INTO public.component VALUES ('d2d9a13c-5944-41d2-ac52-100b3e237b03', 'Allowed Protocol Mapper Types', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'allowed-protocol-mappers', 'org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'anonymous');
INSERT INTO public.component VALUES ('38218cda-c521-48a5-b6c7-b44b8914faf0', 'Allowed Client Scopes', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'allowed-client-templates', 'org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'anonymous');
INSERT INTO public.component VALUES ('0158b43e-fb52-43d5-b387-d21d2087b543', 'Allowed Protocol Mapper Types', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'allowed-protocol-mappers', 'org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'authenticated');
INSERT INTO public.component VALUES ('b10d8026-9a9d-436f-9145-ba329ba95703', 'Allowed Client Scopes', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'allowed-client-templates', 'org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'authenticated');
INSERT INTO public.component VALUES ('1bd5d631-de1b-4941-8608-3b6ce996c7cc', NULL, '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'declarative-user-profile', 'org.keycloak.userprofile.UserProfileProvider', '000c9ecc-9c3a-44d3-94fe-941ff152490f', NULL);


--
-- TOC entry 4228 (class 0 OID 16474)
-- Dependencies: 231
-- Data for Name: component_config; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.component_config VALUES ('e67e6bc1-aab2-4f9c-8014-335f9875e14a', 'dba17502-e981-4281-95fd-f586492140dd', 'max-clients', '200');
INSERT INTO public.component_config VALUES ('a00dba31-81c8-4123-b7ab-7ea6045578f2', 'dbfeec77-ca88-4865-b52a-1e5837667448', 'allow-default-scopes', 'true');
INSERT INTO public.component_config VALUES ('a7b06ff5-892b-4dae-81c2-348c29288940', '2a58c718-b254-498c-8f01-1c6f2edd7531', 'host-sending-registration-request-must-match', 'true');
INSERT INTO public.component_config VALUES ('cf3c2649-959c-4983-8742-3d7cfe3c3b3c', '2a58c718-b254-498c-8f01-1c6f2edd7531', 'client-uris-must-match', 'true');
INSERT INTO public.component_config VALUES ('7003747e-1ccc-425d-af51-57ec259d4b9f', 'ad6b5481-b53c-4fcf-892c-bce7d141c646', 'allow-default-scopes', 'true');
INSERT INTO public.component_config VALUES ('f0809705-e413-43bc-a109-42a9d58804b9', 'a6757934-4a3f-4c1c-b504-30949ce51ba1', 'allowed-protocol-mapper-types', 'saml-user-attribute-mapper');
INSERT INTO public.component_config VALUES ('8fbf649c-f5cc-4ff0-82d1-bcc589a5155f', 'a6757934-4a3f-4c1c-b504-30949ce51ba1', 'allowed-protocol-mapper-types', 'oidc-usermodel-property-mapper');
INSERT INTO public.component_config VALUES ('94a2007a-4732-4503-8333-9b22f3ff6a9b', 'a6757934-4a3f-4c1c-b504-30949ce51ba1', 'allowed-protocol-mapper-types', 'oidc-sha256-pairwise-sub-mapper');
INSERT INTO public.component_config VALUES ('be2cf706-5179-48e1-b9d6-d76fb1c72477', 'a6757934-4a3f-4c1c-b504-30949ce51ba1', 'allowed-protocol-mapper-types', 'saml-user-property-mapper');
INSERT INTO public.component_config VALUES ('6c24bde8-0834-49a4-9242-3114e0e61fad', 'a6757934-4a3f-4c1c-b504-30949ce51ba1', 'allowed-protocol-mapper-types', 'oidc-full-name-mapper');
INSERT INTO public.component_config VALUES ('79e5b387-3d86-4f56-938a-e803782bd855', 'a6757934-4a3f-4c1c-b504-30949ce51ba1', 'allowed-protocol-mapper-types', 'oidc-address-mapper');
INSERT INTO public.component_config VALUES ('70b3cea2-2c8b-499c-9210-08e3b54524f3', 'a6757934-4a3f-4c1c-b504-30949ce51ba1', 'allowed-protocol-mapper-types', 'saml-role-list-mapper');
INSERT INTO public.component_config VALUES ('8e99a7eb-db50-4b50-b184-5cb116ef39b1', 'a6757934-4a3f-4c1c-b504-30949ce51ba1', 'allowed-protocol-mapper-types', 'oidc-usermodel-attribute-mapper');
INSERT INTO public.component_config VALUES ('8c8c38ff-0704-4595-9ba4-a320358a8398', 'aae3ece8-683c-4c97-8859-c55c4a43bdc3', 'allowed-protocol-mapper-types', 'oidc-full-name-mapper');
INSERT INTO public.component_config VALUES ('ed5e1679-f2f7-47db-91b2-b8081aacee0a', 'aae3ece8-683c-4c97-8859-c55c4a43bdc3', 'allowed-protocol-mapper-types', 'oidc-address-mapper');
INSERT INTO public.component_config VALUES ('8b931573-aef8-4502-a893-f99617a9e39b', 'aae3ece8-683c-4c97-8859-c55c4a43bdc3', 'allowed-protocol-mapper-types', 'oidc-usermodel-property-mapper');
INSERT INTO public.component_config VALUES ('1d5930da-406c-4251-b2ae-ef1e9ad50aed', 'aae3ece8-683c-4c97-8859-c55c4a43bdc3', 'allowed-protocol-mapper-types', 'oidc-sha256-pairwise-sub-mapper');
INSERT INTO public.component_config VALUES ('1f94fa19-02a6-41d0-8090-834c31d3544b', 'aae3ece8-683c-4c97-8859-c55c4a43bdc3', 'allowed-protocol-mapper-types', 'saml-user-property-mapper');
INSERT INTO public.component_config VALUES ('f942276f-0e72-4e13-9e39-fb197a006471', 'aae3ece8-683c-4c97-8859-c55c4a43bdc3', 'allowed-protocol-mapper-types', 'oidc-usermodel-attribute-mapper');
INSERT INTO public.component_config VALUES ('42f2bde0-7d98-4963-9e70-dbdb961e5075', 'aae3ece8-683c-4c97-8859-c55c4a43bdc3', 'allowed-protocol-mapper-types', 'saml-role-list-mapper');
INSERT INTO public.component_config VALUES ('484ee8c2-d78b-4613-a94e-008de9184ec4', 'aae3ece8-683c-4c97-8859-c55c4a43bdc3', 'allowed-protocol-mapper-types', 'saml-user-attribute-mapper');
INSERT INTO public.component_config VALUES ('b643cff8-31c8-4947-ae3b-d56f65ddc56a', '892ae70f-9fd7-47b0-9c7c-21247d55fd59', 'secret', 'dpAXcajOFQq9l3PUnXZx-g');
INSERT INTO public.component_config VALUES ('444bad36-b181-4b3a-a668-dbd505572b7d', '892ae70f-9fd7-47b0-9c7c-21247d55fd59', 'priority', '100');
INSERT INTO public.component_config VALUES ('649ce00c-d2f3-42d5-83d1-27f939f2afbd', '892ae70f-9fd7-47b0-9c7c-21247d55fd59', 'kid', '7056261e-b8dd-4947-8ae3-c5f485c770de');
INSERT INTO public.component_config VALUES ('7333ef98-abdc-4c01-9c7e-33e4fe566b0a', '336c9e1d-7fe9-4682-8c09-33d050984ca8', 'certificate', 'MIICmzCCAYMCBgGZ5Ht0cDANBgkqhkiG9w0BAQsFADARMQ8wDQYDVQQDDAZtYXN0ZXIwHhcNMjUxMDE0MjA0NzAwWhcNMzUxMDE0MjA0ODQwWjARMQ8wDQYDVQQDDAZtYXN0ZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDKedu/Lu6dVDg7y+JF7c3MZNXzTs3ZGoodne0aY9dq6x3pQlJCbFVQ0B5zWyb0E1E3wy5/YgXwU4cuU/i9q3vsrn0ZSB87s3xVhtIeJwaLbjYLVLYJ+LL2bC3xkijKAXs3IcOTWtNxi6EnYvRRzbEgZZZAUkqguzl1cF1ZM1RnaqsxsJ95GIsDAk4Kl6ABYEXgW7+VGflSEef0TdhAgfnnsthwtFiR8YBBtfgyNbyyGTPi8oZF7LUcZ64K4hN+3AvsWudFGN061lA+dyiVQEV1K8VF7Lok5T7awIldjt8KNjFLQwy0bNXUhl0oYcKT7aetClnmyadMsvGiQcqpFGUdAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAJIPfqKC2/Lcczk7S3EllbBd6ocT53LeIj6e7mi4HiFdz/Q5e0zQHc54HFnvbmz8IpcLgMxwNLz3AyYCMVmw0Kq+LPFekZ5uiDqsoKWow0GtMwBqtqOKiXDK3CN0GOjfeFXa5WBcbnA9bQTGUp4iJMR/JYp5HXd3LPNRPPy+TmS+ChlNRXLV5D4yyGcDDtIaYOINLORDeT6pj4OygdbOz0VMmcUVaBodeEf7rt6bNtO7W4IjYhQrr9s0UkxfFCtmjs3YcJt6fjLspEL82B4UbuRfk58Zr61aGUk47S9GzFN3zBgEHfiafa/rBzB8f4x+9OCKRg7KrLm8Wc+UFFrtt4U=');
INSERT INTO public.component_config VALUES ('de866f8f-acc4-4dca-910e-d9eeacf1b466', '336c9e1d-7fe9-4682-8c09-33d050984ca8', 'priority', '100');
INSERT INTO public.component_config VALUES ('87c9f98c-af7d-41bd-b6a1-d2f13b6293a0', '336c9e1d-7fe9-4682-8c09-33d050984ca8', 'privateKey', 'MIIEogIBAAKCAQEAynnbvy7unVQ4O8viRe3NzGTV807N2RqKHZ3tGmPXausd6UJSQmxVUNAec1sm9BNRN8Muf2IF8FOHLlP4vat77K59GUgfO7N8VYbSHicGi242C1S2Cfiy9mwt8ZIoygF7NyHDk1rTcYuhJ2L0Uc2xIGWWQFJKoLs5dXBdWTNUZ2qrMbCfeRiLAwJOCpegAWBF4Fu/lRn5UhHn9E3YQIH557LYcLRYkfGAQbX4MjW8shkz4vKGRey1HGeuCuITftwL7FrnRRjdOtZQPncolUBFdSvFRey6JOU+2sCJXY7fCjYxS0MMtGzV1IZdKGHCk+2nrQpZ5smnTLLxokHKqRRlHQIDAQABAoIBAAMBbGfPSF8mf7qHgWwx+6g+kPHOfX4XskLT9CU8ToIkS6qJlP4Dwf/JRG0dm8ZAvn0PlSedQA2mt8Qnc/L2J4ibuHirxObrzaXZXVIcQzEbqYq2hF3r3AA4xTUnoG+14OswbEj02VxUoHJHZO1imnAALLWiDcCKtu94Ll04xqvNofQtbnzCK0dc0YqwCG8Xk5xfVWET6x2H99nYnHd7Mev8EZ8QUWC2WMhNYxkNht1Ne2PU9OKX8a+fqAChOVO1ioCVJ27OIcEMSnmhYI1HZwKZIgJjkHfL/JqPgPa8XRqJileEUUoWiWycBwqvoAWVBQhYcIWSqX29f4iAkX3tiMMCgYEA7P8pTE4mmxcK1qIrTllIZy6Hk4F4FH6h89HGx4Ebxfe43JHpWPg1ukpvE6kaZS+IB/swSnRyOepryX01bGY9HlQ9GcaKT35T3gRjN+4WdcOxKRCMRIidpnSb1MiEuUIClHyOiQsic0rEr4PPkMpE0GzsdP+vSnrlgQR1G7HmWt8CgYEA2rYW34H2W2jklriTfwRS+ywIQNhNPZur8FMANP538nQq25mDWYB0uXiR6pqSyhGKisaN/EEvrGLiKKI6aeNHufDM4V9xxGFRDkt8DiDhuFxQChx9ZkvxhyZ6Fz5r3KcYO6WGNQxpbulWDfFpFqw4RUg85Jer3fawpA/ZDZGNu4MCgYB31Lib9XP9vRPk3JCLCAfc7CDvC2qc6j6XGr2oiHZzjcLx+/EB5Fa+P/6T8VAAU50zc+XB78kF0ar4cQ+/JJ7IpA1U6BdtBFIBkzRbxk2i8/Sy78QMrwsPbCyS1WSOi3rke2pSjse3hdmXaU1dR3it7jVNHy8RuLwslQVloHj5/wKBgHkq8DkbczTpQ9sMnwp7hs2Ic3oZW5GKMROPqEmzwRgdq7DFt7NaK1Clr5Fd2X0BgtOndPoP0y2aCtmgJuSK+i3VbmxdyFWX5KQaxbu+E89jtSQk7IREBqdtda5y8qboG9DPvy6clbzQoNBQsnvRJcucXb/3F0x9YxdBgGq3/OGpAoGAO9/o4v695FiwkjeT6z46z7MXR0Fu5jPnn4ff0KoRsyTwdUAnEjz2/KzO15nW0HBOf1XfLRgRGmxGJOWFnrYa5aAVBc7yI55ESmuN26sqm9uQNOJ5jJb4ZP73DaqmLsoXu4yxng4/50QjU2IfxDdFMUyW7YG9OZ37RQw/XDVmnfw=');
INSERT INTO public.component_config VALUES ('850935b1-d0eb-431d-92e3-2073a6139c65', '336c9e1d-7fe9-4682-8c09-33d050984ca8', 'keyUse', 'ENC');
INSERT INTO public.component_config VALUES ('04245c73-c866-44d0-b1ad-f04fb1644de3', '336c9e1d-7fe9-4682-8c09-33d050984ca8', 'algorithm', 'RSA-OAEP');
INSERT INTO public.component_config VALUES ('221e5d2b-4212-460b-8479-1666e21c31a9', '947bc88b-485a-4db1-b24e-b3ef51917ed2', 'keyUse', 'SIG');
INSERT INTO public.component_config VALUES ('3c230f1e-0b8a-45ad-8edc-28a1e15dae30', 'a2dbd06e-250a-41e1-a046-aad37b093d9e', 'priority', '100');
INSERT INTO public.component_config VALUES ('664da835-49de-4071-98bf-f2baa40d1d47', 'a2dbd06e-250a-41e1-a046-aad37b093d9e', 'algorithm', 'HS512');
INSERT INTO public.component_config VALUES ('583faf66-06b8-43d4-9e3e-2b14e04949c8', 'a2dbd06e-250a-41e1-a046-aad37b093d9e', 'kid', '479dee96-cb4e-4359-9a8d-f29dfdd7b998');
INSERT INTO public.component_config VALUES ('f5fd52c9-9a99-4a74-b47a-3ea8a8d8ccc6', '280cd950-7bf4-4245-bb2d-4357fc3c9cf9', 'kid', 'aa21438e-36fc-472a-9408-f837f1b05981');
INSERT INTO public.component_config VALUES ('7d615fa6-2366-48c9-9981-25e2706b332f', '280cd950-7bf4-4245-bb2d-4357fc3c9cf9', 'priority', '100');
INSERT INTO public.component_config VALUES ('eae35f1d-be44-479b-b734-3b4845fe0380', '280cd950-7bf4-4245-bb2d-4357fc3c9cf9', 'secret', 'BPsdA2q9AK2He4crBaCRSw');
INSERT INTO public.component_config VALUES ('8307e2dd-8b6b-45f7-b120-23521c96840c', '947bc88b-485a-4db1-b24e-b3ef51917ed2', 'privateKey', 'MIIEpAIBAAKCAQEAr9wrPVg0w7NPHp8XkkcUKLjxclmNz6F1eXUDF3J/ReVdnuPfbRzHQpRe3xRW343GR8pn4Y7bDT0kKl28bK9CFLrXLBRWRhPFcNXfl5UnzFjCWJscUwMvqQxa4Dv87e94mbybUbp7ZCmE+S3Z9+Lz9ufjB+DIi+3XcODUDDGh9HAaANv/Ob/P/o/p0lcATi8TT+N3MHH6ODkrmY7HIMEDXEsutaTkbfEpbbkxxldN5xY5F514IQ1icLycyFS2+ucgoMLmhRHAyxshLwVRuJeLW2+kpUdbnNaQxAn6z2xF4WS3DYp7nTlys6X46BftgeUC+wWpkbevXXzJdBQJWZbCfQIDAQABAoIBACZiM4Ta6v9Y9HiuSD6K6Y0+2qI3BjMOnl2hasiUGs/mcWH0AijmWl5/lFpz7cczAldaiARtAgY4dVuS5ITDVvS/2CWclb0LZTGM2NXUviBFsjuVNWAwBpfK5M3jAgBr34KMrkjvHy38OvQJLDVE8bNPJxgp2ZPjGH4gcF/t+FepwECF4VljAdOj8TiErAMfnXv+Uf0LOZ3EGzamHVCjheGVczQc19jPjosxWlHSZSeDWRRSQaqks5Ebc+NoLhB+Al4SDpebXlVLD7kBZVzWaTenvl84sfOPdKoPhw9+5cZQuJ0ozf1n3w8NY8lhYjms3pXjoBI54XxiZ9+PhmEAZLECgYEA5D+E1ObCVpf0d9/CSk9yikBabMwdHOCQ/pVBNB/z6SpNKiZjb53pfmcPDCIw/LBHxOv9t1D4InritxjL1kje8Gk0LwxF51Lfd31SyPvmle1wSzh/wPXwZc/hbYbooY+mIHYFuqlEJNPQ6FjlLTNLmOcATiA52pkkOpRz7TNS/a0CgYEAxT4C9XPLA9D7GNA5uSBN14XPRt4Y7OmrFZ3ekfJ5Je8EPsbVUx6CUTqcpMkm4snC53w6xnl3B5R5dL3a+INR8GMA1kmEpxeAuxD0kjWQz4XqzabV7Wk5VsvMOGFp81/g6BZE/ULnRO+vbj6B8CYGjHnE8D6JKRQT+RiTJjhs0hECgYBV1BzbAjsp3NItEZM55k4n9rMKHmcEKN3dHbr7ItjRYPrLUswpeLQIuDBMW78YBiG2xxcNDAGC1brTJxvfZF+Q/76DwpW2us8VW6b5tN+smTCU2JYRtWnEnzshuI1Z026g3kChRG0/e/cep+7l5FgVEyhmOHAI53VcId7F33rhsQKBgQCKRYGffnBImZ0ddQOyQvIu75AyVwpUMy8LdWONHtVNAXURaSQtI8splJQxdQ48mEJ5Mv6lGouWFcDbVSkHZE/x3AW/M0S6OmC1Qxqg0MpWoMPNLXL0/voCXdYphCjZQ1KQgOQWQ2uLSRfLiihfKNkYa1jjLoPK91dVHaQyfAXVcQKBgQDLFLuPfBZshQ7HjmaA3gdFnatszJxx0ORc83Z9o2FGYfCJuqcVZYoOplXvrfng+EnFv5FjF7fDDEG0C3sU4ZnJOyBxH0dEHMwdycmq2MznEHEtPus5XnfPECCOEkhvHYMDoPuIEw06PztitKsQA4Zr4Tjd0xZ2/F+Q0QDTwdrxKA==');
INSERT INTO public.component_config VALUES ('6ce70c86-4cdd-4dc7-ab08-f3863ec040b3', '947bc88b-485a-4db1-b24e-b3ef51917ed2', 'certificate', 'MIICmzCCAYMCBgGZ5Ht0JTANBgkqhkiG9w0BAQsFADARMQ8wDQYDVQQDDAZtYXN0ZXIwHhcNMjUxMDE0MjA0NjU5WhcNMzUxMDE0MjA0ODM5WjARMQ8wDQYDVQQDDAZtYXN0ZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCv3Cs9WDTDs08enxeSRxQouPFyWY3PoXV5dQMXcn9F5V2e499tHMdClF7fFFbfjcZHymfhjtsNPSQqXbxsr0IUutcsFFZGE8Vw1d+XlSfMWMJYmxxTAy+pDFrgO/zt73iZvJtRuntkKYT5Ldn34vP25+MH4MiL7ddw4NQMMaH0cBoA2/85v8/+j+nSVwBOLxNP43cwcfo4OSuZjscgwQNcSy61pORt8SltuTHGV03nFjkXnXghDWJwvJzIVLb65yCgwuaFEcDLGyEvBVG4l4tbb6SlR1uc1pDECfrPbEXhZLcNinudOXKzpfjoF+2B5QL7BamRt69dfMl0FAlZlsJ9AgMBAAEwDQYJKoZIhvcNAQELBQADggEBAC2woEtTZcHnoMQhyIZ+bd7aCdhOlaWunbnZRHupVtKvY7+7I+7k6N8XuO3vZ3qwZ6Ig+wWqVgu07quB+8Y3YlaxcDbwDRItO71z/z5OAuVUOIDJjmNKx3b6CEHVMS5QBsk0y8G5VbiiFAoOtn2RDdObzHVnmxViQ9fXMonxNh//oofFBeDsFuKvxHd56gYkne3GfNLj74pD3O350+LU+Qu6EjGRthyk16egMyVwwonD2CXksJ3+/GzCkAWVYBmYavOvpLb7s8k0ujr5TUAf06u9mLBj4luDjSIpV8Qa9s2vNDI8BguNleVfs1IO4p559VTqL+jmgVuqZYLjfVGP3xk=');
INSERT INTO public.component_config VALUES ('967f8a9c-524e-4dd3-bc0f-975e48295f64', '947bc88b-485a-4db1-b24e-b3ef51917ed2', 'priority', '100');
INSERT INTO public.component_config VALUES ('cc3cbd69-997e-450f-822a-fd8ef693efea', 'e3e1e0d5-5f76-4581-83b6-25573587f609', 'kc.user.profile.config', '{"attributes":[{"name":"username","displayName":"${username}","validations":{"length":{"min":3,"max":255},"username-prohibited-characters":{},"up-username-not-idn-homograph":{}},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false},{"name":"email","displayName":"${email}","validations":{"email":{},"length":{"max":255}},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false},{"name":"firstName","displayName":"${firstName}","validations":{"length":{"max":255},"person-name-prohibited-characters":{}},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false},{"name":"lastName","displayName":"${lastName}","validations":{"length":{"max":255},"person-name-prohibited-characters":{}},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false}],"groups":[{"name":"user-metadata","displayHeader":"User metadata","displayDescription":"Attributes, which refer to user metadata"}]}');
INSERT INTO public.component_config VALUES ('007bf357-63be-434f-b840-00413cd2423e', '6bbd981a-edd1-43a9-a08f-e30e47090c1c', 'algorithm', 'HS512');
INSERT INTO public.component_config VALUES ('849bbbfc-69b3-402f-b8db-126d39579288', '6bbd981a-edd1-43a9-a08f-e30e47090c1c', 'secret', '68VuoaiBr3tNRrLF6_6MEWTBZ9xWnInZcTBG3rD9jNiLxBVhNMpoyodRRPSif_PGxXTC3_spBgHCOCxtqIZ8agHlvVc-1MEx4TKoifuZbu4q_riZIbA4AyAW_humsHqSWW7TXW4vIyVHBjuA4SuPmTTSPJfLenUrLXc7paQCzBY');
INSERT INTO public.component_config VALUES ('3e7db590-ee9b-4bab-83b8-9a7bc553715f', '6bbd981a-edd1-43a9-a08f-e30e47090c1c', 'priority', '100');
INSERT INTO public.component_config VALUES ('52f574c6-71a4-4586-827d-062d0c20d967', '6bbd981a-edd1-43a9-a08f-e30e47090c1c', 'kid', 'b65a91a2-32a8-4aba-858c-0fd5c2544801');
INSERT INTO public.component_config VALUES ('bce5c5d5-b482-4a5b-b70d-f2899406fbdf', 'ccc9f8d7-d7ca-4429-91df-6ec66dbe8163', 'privateKey', 'MIIEpAIBAAKCAQEAlhoZmkaO15SkUM7IERl44zsdHKm2RgbWGn6b3yOC/qWrai32gSsRFsg3Qn9uT4K7pQ3bPafUy5h2HMf2OvRRB9qwBwEgPpKGFQOV8+x7NftoYpXzsVqeT9j4zGNq+zd9FSvhxj87EfEWunu8CNwT/TBT6BmurYgBfZidhgIO97P6B8WQoLJtv/lVNg8FoZwcdm+6l6uPAMTVvjeClVCcPZMcHlAr/sqZEsfbULp9XpzlIT2dGVNaV3egKNoPvFoHrXf3ZZBVThV/ULRT4EDuIUYvCMeIgrg3C+YBoJ+33jp0NNLXVj35MTE1ZuoQLLwFtzGS1d8Tz0X8QJbuQQ7ZpQIDAQABAoIBAAa8b53ei5OtpO0dG9nhQ9f7Y7xQ+nAskjMDWmE6bFXGCgoHENsC8NlN+BA40fK+r3Hstq7O52wRRhWsZ0awhwARppjTNQb8gjNoYzRHOSVMSHGKK12axI7ZR3BmssWeMR5q3HmOMLYGqio0Giq8nlIHDJuWfCIR/90gJPY/WpFvoDsTtUc9/QxEJmgrHkKwlvzBZA5nLUmYe14nE+DMNSd5qN35s/2SHPzRf1U9dXnnlsPx3dMDEApv4eUAvAFg6s4gvuStf25DCoyOTqrox+NzjijOG05QUG1JLr9ZdHwKQJcdYAADAy/PVbet/KcO0YZdELHkcY5QSYWi8aOsjukCgYEAyAgowPtGizoLm0N5P8A+mkOoFpKP9TVquuawoH/sz+ZE6EnP2BD9v6L30h3ZFX07F0KRUwJmyVNtC9yxkUUZ5YJU/sR45+tznmRpGUyAM144M2cfhxRpQK6iSvh8y2XligCLghkT49WfCkrMqFblYo60pWWqXOzB62itNy9f8B0CgYEAwBmSNFoKewOwLAwk+MQrDyQsrW5m6ZTiHp3WOE2Rh2MjQrW7mYR74yQHWlpK7v1pUY4pVtSDV3kp/p9509ZyHcTXqbIGB/NbnYOz5mjjhylg1obyf004xGwNX8kK76XE5+FQvs9UcQPB6LHnqCQ5E1NvjdjoAzESNNece/MT6SkCgYEApuHHvljknbsre7lrKrikgeb4EPzthVGvXYagzQZs93XQ/0q1UDm8uWipAG9OcRMtfVZYD7ztLAGh9EeHDP9tf4CgkHwxsqtIplh3JlggjLqKgLgEIZnxxbjsRUfSNY8pVVznBv8NDQNn0BpfbAIzFWqhY2vSGfycPF30RRoNHDECgYANEHAiAVGfJhQQGs9U37px8CrdrJlxHz/1hxRvhc703yghvExC14C5ZNTfLy7TbAaClmF3V0KLa2EQwPW/E2F1ZtKn5sSEO+eqIa/VZqK6qXS9gjXxtGW87gBG2FxXCfYHMwqTv3Plr7S7R4YSqEv9ZXo7slmtBeRQFa29vD1JaQKBgQCq3mbQnSv3X93qcWF0MckjROWu9J990BigQaR4zhLDyksNSIoKe98uzCLYG+zd/NXSJH5TwQuftLzYOrfTsLsFYZIV1tbyvdGxNuVrtNKmYPvhJ2/u3usS12bxzvXXWnmSyg3JlosDQzjsLD9hRijoaZGgt7BGbqKlbRHHqzuCqw==');
INSERT INTO public.component_config VALUES ('61da2365-8c8f-4a77-a6fa-d07bb037259d', 'ccc9f8d7-d7ca-4429-91df-6ec66dbe8163', 'keyUse', 'ENC');
INSERT INTO public.component_config VALUES ('c6967537-560b-41e8-90a1-ef32610331b8', 'ccc9f8d7-d7ca-4429-91df-6ec66dbe8163', 'algorithm', 'RSA-OAEP');
INSERT INTO public.component_config VALUES ('2982f239-20e9-4550-a2f4-75fd735b1422', 'ccc9f8d7-d7ca-4429-91df-6ec66dbe8163', 'priority', '100');
INSERT INTO public.component_config VALUES ('94f7b48d-a068-47bf-a043-95617b1b34ca', 'ccc9f8d7-d7ca-4429-91df-6ec66dbe8163', 'certificate', 'MIICqTCCAZECBgGZ5INO1zANBgkqhkiG9w0BAQsFADAYMRYwFAYDVQQDDA1hbHVtbmV0LXJlYWxtMB4XDTI1MTAxNDIwNTUzNFoXDTM1MTAxNDIwNTcxNFowGDEWMBQGA1UEAwwNYWx1bW5ldC1yZWFsbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJYaGZpGjteUpFDOyBEZeOM7HRyptkYG1hp+m98jgv6lq2ot9oErERbIN0J/bk+Cu6UN2z2n1MuYdhzH9jr0UQfasAcBID6ShhUDlfPsezX7aGKV87Fank/Y+Mxjavs3fRUr4cY/OxHxFrp7vAjcE/0wU+gZrq2IAX2YnYYCDvez+gfFkKCybb/5VTYPBaGcHHZvuperjwDE1b43gpVQnD2THB5QK/7KmRLH21C6fV6c5SE9nRlTWld3oCjaD7xaB61392WQVU4Vf1C0U+BA7iFGLwjHiIK4NwvmAaCft946dDTS11Y9+TExNWbqECy8BbcxktXfE89F/ECW7kEO2aUCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEARIbevVBgyv5+/Btp6SrzAfiwFZjnD701qpoByh9J5grLPMK7MGIJd0jbwcRtZ8QU+g6oJ7j3LigCk3hsVp16/cmEt0s+PEFmvjGvtJ1nrX/Tufz1t0KG3v3tiwWS7kYfOtBNEppaauvYucMbLUdNfhWGSYgIMj1ZZ/gAKO6RvcSvu4DoYhbcV6Lki2G3gaTfcOH5y8qQBcNMsXNdarMAQB+M4CA/eBzdJJNgEZH+PCczlkoqFXVJvCNR+fHXmIpJr193Q6DH3TAfUo3958LdQWBZ0gTnKn1JDVNnsPyypWpFY1ELcjc3iFX5JEktW64WHJN7u0UjjSLNEz+yJgvQbQ==');
INSERT INTO public.component_config VALUES ('ed807bd5-39b9-4d1b-a25b-9bab44ac5120', 'a2dbd06e-250a-41e1-a046-aad37b093d9e', 'secret', 'ry1NwvYsoRLIL4Zstxy3Uq4W4feHBel98F1sKCXi0g6p8CVnA_QaDc9b73q2o4YZsYOgUGizLqMwKk1xA1rgMbZKFusBf3Myu_AVI81dU0ic9Mt4vmn_wzZCsF84ehIBIE61PullXIp1cr5T95twh9FiQe4-paH73Fv06eRKNm0');
INSERT INTO public.component_config VALUES ('216b2803-c96d-474b-b4fd-7676a43a8a85', 'd5ffbca9-b26e-4bda-8e7e-ebb67d7898c7', 'privateKey', 'MIIEowIBAAKCAQEAsmhnsTd1++Ti6c60cYYlPfCsBA7EfCbQ5/uI3LDX7g/frhAtnEOXBGyz9QFzyYogKqo5+pY9ofD0SJTe43vqcw86vsUvSGYc3e/RWU1BEEOpn8Kt2wpnjfrlXkjesJ2Z+f3Uq+9Zyrg5PMl5A4CFeVk18FiGsEDLais/wg9RkWCFQdvYLKblUed0DfBTE5N6gWO3C+AK1dSbgyDTifFT6GG0JjZpFNxG0As1PSwUZuBdF1++ZieySMg5sP7OUZol2h/ZOtLmWCckZi1f9hhoO5ZN8NXT0eKFwS2rxlrpI/vk/xH4UQ5re6jR4rQ0t9sG8jdmX/SBnwn9cziCkShoDQIDAQABAoIBAAGGKWAJL/fWMgKfUCS8IH2a03HvJKWzb8JJSamX1SdAMFJFoWT5WI40sTxKuHSkcUmeTczHOBNIOT4CodjP7uYUcaeZjH0kRZoAVS43HgVQ1YP7KDMOHY5aO1erR/qV+8sux8mbFNclNb2t6Tcq3y/in6RWaLFKMPvOxesXMY2egauObuDlsGlrRkqg55xoHSWXYUDCFqSoeaiQ7Me7cM2qhcrWGHWFweVYoycVWy0TDQ2v5A5GsrI+JcrmbCfuA8pR8pTX/TToGHxHTV+9RsiPjzGWK89W90mDWHb3lhVxM7WR9fmEG/QX0kQyK0grlJrHiOkcvfpLZtXS2q+90P0CgYEA23dLfNpkdA1h7T9jbGh7hNdVbhXK1mSuUJxcaE8DLCAmbqROpa9uMbGKvXJ9FspOZj5U5tOb2HGKhORvVJu8ipKhsuhRBtOe1TSHJUKKPLu5NP+g309FHyiar68isdyRd3HMrqPkWEz20aaS3I4dwWuk7o8ja+EsbKuYlZalNyMCgYEA0Bti46Er1IJDrtQkzDNq3MfMUJsxgIc9ZxobAlkS4hloya/xn2HNuD+B33S/VVbVDr6+I9vBTC7HliQPWhBTL1fxfUwKcKW1ds3u5YBfGCxKKwkDdIFYdbpRaSrbwsuhCKrAXjsjQzuZ/mXeTPflSWk+aKBPYMfh4gDsk81Gbw8CgYB3KipJ68d5oD6Y9L9GgOD4u3d+o8SUbuybhptCZAyj6/0SPJMbscrSnsVnon+7XTP+nj+5ahMIDnaZO/Qba8iPMZktLKm6XDO1LqVnHN80pPWmilrOhhtRFNoRJLZg/xPZWGg8N29oZrnqEllR+rS7bniKtBwWmphllTLvnnGtIwKBgQCzkc4EqP/PARAx/TA7W2qsU2LDcwaF5yxemLIRlpaqrk4zKjSN2LDQeUwxauXmV2TEsmYTPv5OJFdoAHmWt1twEKx593FSvkoU16F6OwjTLPRaqg5nK20PONQisS6rqVWsytnu9Yx56SX51CC7vXQFomCNmzajRhZtE2sQJiLOlQKBgAFmGqTjVN6k/I/Qx729vXguCRAS/JvYWPG3MNhLfHh63aw1TOL8CHGVeKk8MyDbFWbjRDWJrCx/Je3HL4oxXiKdD9xtU3MJEsf1Dw2fG6gXcOxaRIJYnB9cfdPTv7xX3yoWYZe1wrEd0bQufIvBROy1hoFcidvqlFnNyc44eATx');
INSERT INTO public.component_config VALUES ('f946b5c5-9b85-45ff-bd59-ed62dac556a5', 'd5ffbca9-b26e-4bda-8e7e-ebb67d7898c7', 'keyUse', 'SIG');
INSERT INTO public.component_config VALUES ('577dc930-ced3-4ed9-b010-c31952866933', 'd5ffbca9-b26e-4bda-8e7e-ebb67d7898c7', 'certificate', 'MIICqTCCAZECBgGZ5INOGTANBgkqhkiG9w0BAQsFADAYMRYwFAYDVQQDDA1hbHVtbmV0LXJlYWxtMB4XDTI1MTAxNDIwNTUzNFoXDTM1MTAxNDIwNTcxNFowGDEWMBQGA1UEAwwNYWx1bW5ldC1yZWFsbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALJoZ7E3dfvk4unOtHGGJT3wrAQOxHwm0Of7iNyw1+4P364QLZxDlwRss/UBc8mKICqqOfqWPaHw9EiU3uN76nMPOr7FL0hmHN3v0VlNQRBDqZ/CrdsKZ4365V5I3rCdmfn91KvvWcq4OTzJeQOAhXlZNfBYhrBAy2orP8IPUZFghUHb2Cym5VHndA3wUxOTeoFjtwvgCtXUm4Mg04nxU+hhtCY2aRTcRtALNT0sFGbgXRdfvmYnskjIObD+zlGaJdof2TrS5lgnJGYtX/YYaDuWTfDV09HihcEtq8Za6SP75P8R+FEOa3uo0eK0NLfbBvI3Zl/0gZ8J/XM4gpEoaA0CAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAL2m2VyfZKKjg5TGyrwfFPmectF2xEFV+EQuD0c+liRCXxx/FsMccBWDSLY6DlSLesJ04Ojngv+eMutqqVN1cEV6CaFGjYKAWUX3KERUK+yZ5A6PpjiyXhw7onl1WMo+xeqj2MOiOEaOWiKaZ0ixOVNEHdljZYuFilVCkfBrf8bA8WQKgpXD2y7JwY/TgiYyy7dMiYef7yQM2/PI2BHjC59Md4mYLYKwKKFjI45LzPlblGPm3YGM4e8E1ue8lrw6P1A3BxtTYfDw6saKDbAt8xCUPtUWUsfv/crGr+69hPcpWLEZR484fql7uMDaVXVxTGvvjw+ugXfHBC4aRTwbNnw==');
INSERT INTO public.component_config VALUES ('3d95e612-855e-454b-ad21-34f6356dc786', 'd5ffbca9-b26e-4bda-8e7e-ebb67d7898c7', 'priority', '100');
INSERT INTO public.component_config VALUES ('29d877d1-fc1f-4e41-a367-ade9d0b38a60', 'd38dbbdd-ece6-4519-89cd-a4580291b6e2', 'max-clients', '200');
INSERT INTO public.component_config VALUES ('6c5baef4-a4e5-4591-85fe-c8d5765df571', 'd2d9a13c-5944-41d2-ac52-100b3e237b03', 'allowed-protocol-mapper-types', 'oidc-address-mapper');
INSERT INTO public.component_config VALUES ('7df3dea1-9cb5-40f7-b2f1-7c230911d574', 'd2d9a13c-5944-41d2-ac52-100b3e237b03', 'allowed-protocol-mapper-types', 'oidc-usermodel-property-mapper');
INSERT INTO public.component_config VALUES ('13646bf8-ef0a-4c1b-9acf-d3a600e3c382', 'd2d9a13c-5944-41d2-ac52-100b3e237b03', 'allowed-protocol-mapper-types', 'oidc-full-name-mapper');
INSERT INTO public.component_config VALUES ('6f6eaa90-25ea-433a-b84a-194e493d4c4b', 'd2d9a13c-5944-41d2-ac52-100b3e237b03', 'allowed-protocol-mapper-types', 'saml-user-attribute-mapper');
INSERT INTO public.component_config VALUES ('8eac850f-ef32-4abb-90c6-63cbfe9e120e', 'd2d9a13c-5944-41d2-ac52-100b3e237b03', 'allowed-protocol-mapper-types', 'saml-role-list-mapper');
INSERT INTO public.component_config VALUES ('0f75bbc8-9091-493c-b43e-dc90f70646f3', 'd2d9a13c-5944-41d2-ac52-100b3e237b03', 'allowed-protocol-mapper-types', 'saml-user-property-mapper');
INSERT INTO public.component_config VALUES ('57748c5f-285f-401d-8822-a67f14002da8', 'd2d9a13c-5944-41d2-ac52-100b3e237b03', 'allowed-protocol-mapper-types', 'oidc-usermodel-attribute-mapper');
INSERT INTO public.component_config VALUES ('6b6bcb8e-7921-4a6b-89c3-2674159258af', 'd2d9a13c-5944-41d2-ac52-100b3e237b03', 'allowed-protocol-mapper-types', 'oidc-sha256-pairwise-sub-mapper');
INSERT INTO public.component_config VALUES ('73cf5f14-6ead-4843-a0ff-8f3e23abcf00', '447f4668-bf39-4fe5-9542-fd499d721190', 'host-sending-registration-request-must-match', 'true');
INSERT INTO public.component_config VALUES ('0a54a435-8a89-4c55-acef-2eecafbaf9a5', '447f4668-bf39-4fe5-9542-fd499d721190', 'client-uris-must-match', 'true');
INSERT INTO public.component_config VALUES ('34aaf33e-dfa1-44d7-b4a2-9e8c13705f2f', '0158b43e-fb52-43d5-b387-d21d2087b543', 'allowed-protocol-mapper-types', 'saml-user-attribute-mapper');
INSERT INTO public.component_config VALUES ('01d603c7-4c95-4e1e-8b67-84cbabc7330c', '0158b43e-fb52-43d5-b387-d21d2087b543', 'allowed-protocol-mapper-types', 'oidc-full-name-mapper');
INSERT INTO public.component_config VALUES ('275b8fa5-28d6-4581-9357-26bac08b003e', '0158b43e-fb52-43d5-b387-d21d2087b543', 'allowed-protocol-mapper-types', 'oidc-usermodel-attribute-mapper');
INSERT INTO public.component_config VALUES ('aa6b53ef-c66b-4844-9c32-ffbdbe7fb9f4', '0158b43e-fb52-43d5-b387-d21d2087b543', 'allowed-protocol-mapper-types', 'oidc-address-mapper');
INSERT INTO public.component_config VALUES ('cab79ebd-88fb-4086-b3cd-9cdab57c4028', '0158b43e-fb52-43d5-b387-d21d2087b543', 'allowed-protocol-mapper-types', 'saml-role-list-mapper');
INSERT INTO public.component_config VALUES ('7bee37b8-ac2f-4a18-b5a9-7933a9eeb4fe', '0158b43e-fb52-43d5-b387-d21d2087b543', 'allowed-protocol-mapper-types', 'saml-user-property-mapper');
INSERT INTO public.component_config VALUES ('1b530736-28df-42ef-af5e-e6d63dc954e5', '0158b43e-fb52-43d5-b387-d21d2087b543', 'allowed-protocol-mapper-types', 'oidc-sha256-pairwise-sub-mapper');
INSERT INTO public.component_config VALUES ('0ea5073f-029e-4813-8c5e-04b0c19a9c76', '0158b43e-fb52-43d5-b387-d21d2087b543', 'allowed-protocol-mapper-types', 'oidc-usermodel-property-mapper');
INSERT INTO public.component_config VALUES ('0c380734-0c51-4db4-a7c7-2fc05ace7694', '38218cda-c521-48a5-b6c7-b44b8914faf0', 'allow-default-scopes', 'true');
INSERT INTO public.component_config VALUES ('e07c8da7-7a56-4146-9528-b5ebc2daaa93', 'b10d8026-9a9d-436f-9145-ba329ba95703', 'allow-default-scopes', 'true');
INSERT INTO public.component_config VALUES ('cbb7dd06-dc50-4403-9364-20cea7e28ce2', '1bd5d631-de1b-4941-8608-3b6ce996c7cc', 'kc.user.profile.config', '{"attributes":[{"name":"username","displayName":"${username}","validations":{"length":{"min":3,"max":255},"username-prohibited-characters":{},"up-username-not-idn-homograph":{}},"annotations":{},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false},{"name":"firstName","displayName":"${firstName}","validations":{"length":{"max":255},"person-name-prohibited-characters":{}},"required":{"roles":["user"]},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false},{"name":"email","displayName":"${email}","validations":{"email":{},"length":{"max":255}},"required":{"roles":["user"]},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false},{"name":"lastName","displayName":"${lastName}","validations":{"length":{"max":255},"person-name-prohibited-characters":{}},"required":{"roles":["user"]},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false}],"groups":[{"name":"user-metadata","displayHeader":"User metadata","displayDescription":"Attributes, which refer to user metadata"}]}');


--
-- TOC entry 4229 (class 0 OID 16479)
-- Dependencies: 232
-- Data for Name: composite_role; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', 'b2132454-dffa-40df-838e-3e33b208644f');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', 'd6212e65-08f9-485f-9c21-b4edcc3c9fc7');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', '70cd2784-d68e-4e35-9484-b6dcd23efd61');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', '184274b4-465f-488e-a749-0e637b189160');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', 'cae3c546-c55a-461d-935b-4be9d51908e6');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', 'ce317b98-57bd-42a3-9c5c-9e7cfa251ffe');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', '86ac1f47-c9c3-496f-ac21-085e5c3f3eb8');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', 'a3c1321a-81aa-4c38-9457-0fc0e6aaa38f');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', 'ca9bb414-b703-46f3-8e7d-4a51c3737765');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', 'b048a423-d753-4aab-96d2-7ccd2c95df3c');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', 'aec83f14-d848-4342-8baf-0d3315d64503');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', '938bcef4-4540-4c66-9ee2-77cfabca87b6');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', '398283d5-3e77-4fcc-aa45-3b230886f441');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', '039eb199-78d8-4477-808f-cb22d297afce');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', 'b2ff4369-7e5f-4f20-aef4-2764ddeaa3e4');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', '24553704-44e0-471d-b658-08468aa95a9b');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', '9ba15469-de14-41f9-bcd1-414eb48e1a9b');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', 'f84e5f2a-426c-480c-af6c-a761651fe8e6');
INSERT INTO public.composite_role VALUES ('184274b4-465f-488e-a749-0e637b189160', 'f84e5f2a-426c-480c-af6c-a761651fe8e6');
INSERT INTO public.composite_role VALUES ('184274b4-465f-488e-a749-0e637b189160', 'b2ff4369-7e5f-4f20-aef4-2764ddeaa3e4');
INSERT INTO public.composite_role VALUES ('83d02c9a-4d21-4e86-b3a5-c4772f85ec6a', 'd8ded547-7d41-45e7-8b23-afdffccd6b3d');
INSERT INTO public.composite_role VALUES ('cae3c546-c55a-461d-935b-4be9d51908e6', '24553704-44e0-471d-b658-08468aa95a9b');
INSERT INTO public.composite_role VALUES ('83d02c9a-4d21-4e86-b3a5-c4772f85ec6a', 'b95c529b-ef8d-44f5-bd1f-47086213315b');
INSERT INTO public.composite_role VALUES ('b95c529b-ef8d-44f5-bd1f-47086213315b', '82e8e12e-0fea-4e53-928d-bf2bf3dbbfb0');
INSERT INTO public.composite_role VALUES ('252664c3-be38-45a1-9b54-4aab298efebb', '6792f9a3-3403-4275-8837-0d545d88f733');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', 'b04d8676-b711-42ec-bc86-ceed0bd5d485');
INSERT INTO public.composite_role VALUES ('83d02c9a-4d21-4e86-b3a5-c4772f85ec6a', 'a0219b69-16e6-4455-a1ac-f04e2a236a21');
INSERT INTO public.composite_role VALUES ('83d02c9a-4d21-4e86-b3a5-c4772f85ec6a', 'a094f044-1586-4448-b116-3d30223d17fb');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', '94b1c888-87d1-42d7-800e-394728dff586');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', '8306760f-c0b3-4469-bedd-9c5fe077bb9d');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', '8bc720dc-4b8f-4d3a-83ff-925e52e7e6a9');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', '610438f2-3ea4-4429-b731-d60216d7f238');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', '6e79f3fa-e216-4384-bdc3-9ce95fce8b14');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', 'ff586ac2-3b94-4487-8bb8-63d98dbb16b3');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', 'e41b30e3-875e-4a6c-8d39-2a32ae06d63b');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', 'e195f23a-b529-42d7-af77-64e73199f801');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', 'a8be5c2f-be83-41b8-9cb9-f35cc4ee82a1');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', '274ab78e-1f1f-40bc-8e10-5458e91db17b');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', '3d7dc8fc-820b-44bd-9b75-d39b972ef2b9');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', 'f22cac6b-f114-401d-9504-cfe1917dae1c');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', 'd4801f2c-c1c0-4e24-bdba-e9a41dd21d93');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', '4aae8d25-631f-4113-ba73-dac0102881d2');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', '4cf8544f-937f-4f77-92c3-51bf5c9847f7');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', 'f828f806-416b-4f7c-b254-cf4d93e2e7f5');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', 'aeceae38-c935-4f5c-8dec-6455461c925c');
INSERT INTO public.composite_role VALUES ('610438f2-3ea4-4429-b731-d60216d7f238', '4cf8544f-937f-4f77-92c3-51bf5c9847f7');
INSERT INTO public.composite_role VALUES ('8bc720dc-4b8f-4d3a-83ff-925e52e7e6a9', '4aae8d25-631f-4113-ba73-dac0102881d2');
INSERT INTO public.composite_role VALUES ('8bc720dc-4b8f-4d3a-83ff-925e52e7e6a9', 'aeceae38-c935-4f5c-8dec-6455461c925c');
INSERT INTO public.composite_role VALUES ('8bdb3d68-fe5a-4d3e-b81b-5a63cca0ad7a', '7212e416-3619-4e82-a2fc-d449342d80fc');
INSERT INTO public.composite_role VALUES ('8bdb3d68-fe5a-4d3e-b81b-5a63cca0ad7a', '25b46a59-f021-43ea-885c-2e43d7daca46');
INSERT INTO public.composite_role VALUES ('8bdb3d68-fe5a-4d3e-b81b-5a63cca0ad7a', 'e48a3acd-c896-4624-988a-2b697bbdaf6d');
INSERT INTO public.composite_role VALUES ('8bdb3d68-fe5a-4d3e-b81b-5a63cca0ad7a', '95afcb48-6cfe-4db6-98fb-751c3d0cfcea');
INSERT INTO public.composite_role VALUES ('8bdb3d68-fe5a-4d3e-b81b-5a63cca0ad7a', '1679332a-b26f-49dc-b35e-ab358ac09320');
INSERT INTO public.composite_role VALUES ('8bdb3d68-fe5a-4d3e-b81b-5a63cca0ad7a', '55ebdd66-30a9-4981-8ed1-e3260dacfb49');
INSERT INTO public.composite_role VALUES ('8bdb3d68-fe5a-4d3e-b81b-5a63cca0ad7a', '4ebb0d5e-bcf4-4432-859f-a84422fada5d');
INSERT INTO public.composite_role VALUES ('8bdb3d68-fe5a-4d3e-b81b-5a63cca0ad7a', 'c5e4e6b1-7b07-4319-a558-1446a413ad29');
INSERT INTO public.composite_role VALUES ('8bdb3d68-fe5a-4d3e-b81b-5a63cca0ad7a', '713a0132-1077-44c2-a7a8-547a9ed2aeea');
INSERT INTO public.composite_role VALUES ('8bdb3d68-fe5a-4d3e-b81b-5a63cca0ad7a', 'fa192e7f-b3b8-434c-80e4-c6e8fc3bf76c');
INSERT INTO public.composite_role VALUES ('8bdb3d68-fe5a-4d3e-b81b-5a63cca0ad7a', '320ad00d-df4f-49b7-8c60-9ef7d526b76c');
INSERT INTO public.composite_role VALUES ('8bdb3d68-fe5a-4d3e-b81b-5a63cca0ad7a', '4aed72c9-e297-4154-845b-74da79442fcb');
INSERT INTO public.composite_role VALUES ('8bdb3d68-fe5a-4d3e-b81b-5a63cca0ad7a', '89b91be0-4af3-4bca-88c0-900efb01528b');
INSERT INTO public.composite_role VALUES ('8bdb3d68-fe5a-4d3e-b81b-5a63cca0ad7a', '8abb284b-e04d-42e8-97ff-028021fc669f');
INSERT INTO public.composite_role VALUES ('8bdb3d68-fe5a-4d3e-b81b-5a63cca0ad7a', 'e285353b-de98-44a9-b14f-cfb2ed73d59e');
INSERT INTO public.composite_role VALUES ('8bdb3d68-fe5a-4d3e-b81b-5a63cca0ad7a', '139e8d31-d815-44f9-b55b-4e70a39b1813');
INSERT INTO public.composite_role VALUES ('8bdb3d68-fe5a-4d3e-b81b-5a63cca0ad7a', 'f56c19f8-d803-405e-9f32-15f28dba1b1c');
INSERT INTO public.composite_role VALUES ('0fc1515d-32eb-4643-b9e9-646337839092', '39fb8cd7-7bd2-428b-a1e3-552fa1b7982f');
INSERT INTO public.composite_role VALUES ('95afcb48-6cfe-4db6-98fb-751c3d0cfcea', 'e285353b-de98-44a9-b14f-cfb2ed73d59e');
INSERT INTO public.composite_role VALUES ('e48a3acd-c896-4624-988a-2b697bbdaf6d', 'f56c19f8-d803-405e-9f32-15f28dba1b1c');
INSERT INTO public.composite_role VALUES ('e48a3acd-c896-4624-988a-2b697bbdaf6d', '8abb284b-e04d-42e8-97ff-028021fc669f');
INSERT INTO public.composite_role VALUES ('0fc1515d-32eb-4643-b9e9-646337839092', '5d9a4233-4be8-4091-bdf1-c1bfd736d4c9');
INSERT INTO public.composite_role VALUES ('5d9a4233-4be8-4091-bdf1-c1bfd736d4c9', '07e4b0a1-8f96-4b79-a5ed-49afe41df3dc');
INSERT INTO public.composite_role VALUES ('d190edde-d97c-4347-a73a-7ebaa3f71449', '066e990c-a27d-42f7-9b22-28581ae2fc3e');
INSERT INTO public.composite_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', '3e48e728-f874-4e1f-b04f-7e9dcd067f10');
INSERT INTO public.composite_role VALUES ('8bdb3d68-fe5a-4d3e-b81b-5a63cca0ad7a', '5abccc3f-f706-4749-a154-538b77bae7fa');
INSERT INTO public.composite_role VALUES ('0fc1515d-32eb-4643-b9e9-646337839092', '5c4bc45a-6893-4c05-8fdc-3c81acf61bd7');
INSERT INTO public.composite_role VALUES ('0fc1515d-32eb-4643-b9e9-646337839092', '8936874f-9c3a-42d8-9e1f-43c82c66a384');


--
-- TOC entry 4230 (class 0 OID 16482)
-- Dependencies: 233
-- Data for Name: credential; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.credential VALUES ('a9fa30e3-628e-4d8e-b154-06400d310753', NULL, 'password', '017b322f-033a-4d6c-a258-8ca95786e66e', 1760475834604, 'My password', '{"value":"aVLN09QwCEP3Pu35bxD4byv24lsXstD7UZevSOIuXr8=","salt":"pBkDoqwIhEXhkGUTLqeHKQ==","additionalParameters":{}}', '{"hashIterations":5,"algorithm":"argon2","additionalParameters":{"hashLength":["32"],"memory":["7168"],"type":["id"],"version":["1.3"],"parallelism":["1"]}}', 10, 1);
INSERT INTO public.credential VALUES ('636e7742-f388-4b5a-99e7-3f05f821afde', NULL, 'password', '467fca2a-add9-4201-ab6b-ecd48914da54', 1760476216674, 'My password', '{"value":"D6hIqfaAOdjlfK2/H4VjNszjyhZ9qZSUbBo+fGQh/Hk=","salt":"lMtphN3xo77p8s/IUROahg==","additionalParameters":{}}', '{"hashIterations":5,"algorithm":"argon2","additionalParameters":{"hashLength":["32"],"memory":["7168"],"type":["id"],"version":["1.3"],"parallelism":["1"]}}', 10, 1);
INSERT INTO public.credential VALUES ('62cedfe4-187e-4168-9eff-8bb5b8dbf647', NULL, 'password', '7a7ffec9-1041-4c28-8fec-f8e958db8bbf', 1760559060710, 'My password', '{"value":"UALpI5NEARwBRUEhhH4iqO+3rEbbKLyotyQv8tUnkEk=","salt":"wQ+ac2ZyS/gYBxU/TQ1sbQ==","additionalParameters":{}}', '{"hashIterations":5,"algorithm":"argon2","additionalParameters":{"hashLength":["32"],"memory":["7168"],"type":["id"],"version":["1.3"],"parallelism":["1"]}}', 10, 1);
INSERT INTO public.credential VALUES ('b204c29f-926f-4bfd-8703-98285627f065', NULL, 'password', 'dbd69f1a-4a1a-4797-972b-ec0494972068', 1760568810998, 'My password', '{"value":"/6qHNpmfaQXUc5rmcuFaOF6PM9C8Rg3g+As5q/ndlqk=","salt":"gO7LZUpxpZehtmrDwo/KrA==","additionalParameters":{}}', '{"hashIterations":5,"algorithm":"argon2","additionalParameters":{"hashLength":["32"],"memory":["7168"],"type":["id"],"version":["1.3"],"parallelism":["1"]}}', 10, 1);


--
-- TOC entry 4231 (class 0 OID 16488)
-- Dependencies: 234
-- Data for Name: databasechangelog; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.databasechangelog VALUES ('1.0.0.Final-KEYCLOAK-5461', 'sthorger@redhat.com', 'META-INF/jpa-changelog-1.0.0.Final.xml', '2025-10-14 20:48:31.567313', 1, 'EXECUTED', '9:6f1016664e21e16d26517a4418f5e3df', 'createTable tableName=APPLICATION_DEFAULT_ROLES; createTable tableName=CLIENT; createTable tableName=CLIENT_SESSION; createTable tableName=CLIENT_SESSION_ROLE; createTable tableName=COMPOSITE_ROLE; createTable tableName=CREDENTIAL; createTable tab...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.0.0.Final-KEYCLOAK-5461', 'sthorger@redhat.com', 'META-INF/db2-jpa-changelog-1.0.0.Final.xml', '2025-10-14 20:48:31.57983', 2, 'MARK_RAN', '9:828775b1596a07d1200ba1d49e5e3941', 'createTable tableName=APPLICATION_DEFAULT_ROLES; createTable tableName=CLIENT; createTable tableName=CLIENT_SESSION; createTable tableName=CLIENT_SESSION_ROLE; createTable tableName=COMPOSITE_ROLE; createTable tableName=CREDENTIAL; createTable tab...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.1.0.Beta1', 'sthorger@redhat.com', 'META-INF/jpa-changelog-1.1.0.Beta1.xml', '2025-10-14 20:48:31.618043', 3, 'EXECUTED', '9:5f090e44a7d595883c1fb61f4b41fd38', 'delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=CLIENT_ATTRIBUTES; createTable tableName=CLIENT_SESSION_NOTE; createTable tableName=APP_NODE_REGISTRATIONS; addColumn table...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.1.0.Final', 'sthorger@redhat.com', 'META-INF/jpa-changelog-1.1.0.Final.xml', '2025-10-14 20:48:31.622323', 4, 'EXECUTED', '9:c07e577387a3d2c04d1adc9aaad8730e', 'renameColumn newColumnName=EVENT_TIME, oldColumnName=TIME, tableName=EVENT_ENTITY', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.2.0.Beta1', 'psilva@redhat.com', 'META-INF/jpa-changelog-1.2.0.Beta1.xml', '2025-10-14 20:48:31.71805', 5, 'EXECUTED', '9:b68ce996c655922dbcd2fe6b6ae72686', 'delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=PROTOCOL_MAPPER; createTable tableName=PROTOCOL_MAPPER_CONFIG; createTable tableName=...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.2.0.Beta1', 'psilva@redhat.com', 'META-INF/db2-jpa-changelog-1.2.0.Beta1.xml', '2025-10-14 20:48:31.724096', 6, 'MARK_RAN', '9:543b5c9989f024fe35c6f6c5a97de88e', 'delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=PROTOCOL_MAPPER; createTable tableName=PROTOCOL_MAPPER_CONFIG; createTable tableName=...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.2.0.RC1', 'bburke@redhat.com', 'META-INF/jpa-changelog-1.2.0.CR1.xml', '2025-10-14 20:48:31.808031', 7, 'EXECUTED', '9:765afebbe21cf5bbca048e632df38336', 'delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=MIGRATION_MODEL; createTable tableName=IDENTITY_P...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.2.0.RC1', 'bburke@redhat.com', 'META-INF/db2-jpa-changelog-1.2.0.CR1.xml', '2025-10-14 20:48:31.813159', 8, 'MARK_RAN', '9:db4a145ba11a6fdaefb397f6dbf829a1', 'delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=MIGRATION_MODEL; createTable tableName=IDENTITY_P...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.2.0.Final', 'keycloak', 'META-INF/jpa-changelog-1.2.0.Final.xml', '2025-10-14 20:48:31.818858', 9, 'EXECUTED', '9:9d05c7be10cdb873f8bcb41bc3a8ab23', 'update tableName=CLIENT; update tableName=CLIENT; update tableName=CLIENT', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.3.0', 'bburke@redhat.com', 'META-INF/jpa-changelog-1.3.0.xml', '2025-10-14 20:48:31.909696', 10, 'EXECUTED', '9:18593702353128d53111f9b1ff0b82b8', 'delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=ADMI...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.4.0', 'bburke@redhat.com', 'META-INF/jpa-changelog-1.4.0.xml', '2025-10-14 20:48:31.961612', 11, 'EXECUTED', '9:6122efe5f090e41a85c0f1c9e52cbb62', 'delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.4.0', 'bburke@redhat.com', 'META-INF/db2-jpa-changelog-1.4.0.xml', '2025-10-14 20:48:31.965762', 12, 'MARK_RAN', '9:e1ff28bf7568451453f844c5d54bb0b5', 'delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.5.0', 'bburke@redhat.com', 'META-INF/jpa-changelog-1.5.0.xml', '2025-10-14 20:48:31.983223', 13, 'EXECUTED', '9:7af32cd8957fbc069f796b61217483fd', 'delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.6.1_from15', 'mposolda@redhat.com', 'META-INF/jpa-changelog-1.6.1.xml', '2025-10-14 20:48:32.004783', 14, 'EXECUTED', '9:6005e15e84714cd83226bf7879f54190', 'addColumn tableName=REALM; addColumn tableName=KEYCLOAK_ROLE; addColumn tableName=CLIENT; createTable tableName=OFFLINE_USER_SESSION; createTable tableName=OFFLINE_CLIENT_SESSION; addPrimaryKey constraintName=CONSTRAINT_OFFL_US_SES_PK2, tableName=...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.6.1_from16-pre', 'mposolda@redhat.com', 'META-INF/jpa-changelog-1.6.1.xml', '2025-10-14 20:48:32.006913', 15, 'MARK_RAN', '9:bf656f5a2b055d07f314431cae76f06c', 'delete tableName=OFFLINE_CLIENT_SESSION; delete tableName=OFFLINE_USER_SESSION', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.6.1_from16', 'mposolda@redhat.com', 'META-INF/jpa-changelog-1.6.1.xml', '2025-10-14 20:48:32.009467', 16, 'MARK_RAN', '9:f8dadc9284440469dcf71e25ca6ab99b', 'dropPrimaryKey constraintName=CONSTRAINT_OFFLINE_US_SES_PK, tableName=OFFLINE_USER_SESSION; dropPrimaryKey constraintName=CONSTRAINT_OFFLINE_CL_SES_PK, tableName=OFFLINE_CLIENT_SESSION; addColumn tableName=OFFLINE_USER_SESSION; update tableName=OF...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.6.1', 'mposolda@redhat.com', 'META-INF/jpa-changelog-1.6.1.xml', '2025-10-14 20:48:32.012113', 17, 'EXECUTED', '9:d41d8cd98f00b204e9800998ecf8427e', 'empty', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.7.0', 'bburke@redhat.com', 'META-INF/jpa-changelog-1.7.0.xml', '2025-10-14 20:48:32.052857', 18, 'EXECUTED', '9:3368ff0be4c2855ee2dd9ca813b38d8e', 'createTable tableName=KEYCLOAK_GROUP; createTable tableName=GROUP_ROLE_MAPPING; createTable tableName=GROUP_ATTRIBUTE; createTable tableName=USER_GROUP_MEMBERSHIP; createTable tableName=REALM_DEFAULT_GROUPS; addColumn tableName=IDENTITY_PROVIDER; ...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.8.0', 'mposolda@redhat.com', 'META-INF/jpa-changelog-1.8.0.xml', '2025-10-14 20:48:32.097344', 19, 'EXECUTED', '9:8ac2fb5dd030b24c0570a763ed75ed20', 'addColumn tableName=IDENTITY_PROVIDER; createTable tableName=CLIENT_TEMPLATE; createTable tableName=CLIENT_TEMPLATE_ATTRIBUTES; createTable tableName=TEMPLATE_SCOPE_MAPPING; dropNotNullConstraint columnName=CLIENT_ID, tableName=PROTOCOL_MAPPER; ad...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.8.0-2', 'keycloak', 'META-INF/jpa-changelog-1.8.0.xml', '2025-10-14 20:48:32.103091', 20, 'EXECUTED', '9:f91ddca9b19743db60e3057679810e6c', 'dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; update tableName=CREDENTIAL', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('22.0.5-24031', 'keycloak', 'META-INF/jpa-changelog-22.0.0.xml', '2025-10-14 20:48:35.173615', 119, 'MARK_RAN', '9:a60d2d7b315ec2d3eba9e2f145f9df28', 'customChange', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.8.0', 'mposolda@redhat.com', 'META-INF/db2-jpa-changelog-1.8.0.xml', '2025-10-14 20:48:32.106142', 21, 'MARK_RAN', '9:831e82914316dc8a57dc09d755f23c51', 'addColumn tableName=IDENTITY_PROVIDER; createTable tableName=CLIENT_TEMPLATE; createTable tableName=CLIENT_TEMPLATE_ATTRIBUTES; createTable tableName=TEMPLATE_SCOPE_MAPPING; dropNotNullConstraint columnName=CLIENT_ID, tableName=PROTOCOL_MAPPER; ad...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.8.0-2', 'keycloak', 'META-INF/db2-jpa-changelog-1.8.0.xml', '2025-10-14 20:48:32.109124', 22, 'MARK_RAN', '9:f91ddca9b19743db60e3057679810e6c', 'dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; update tableName=CREDENTIAL', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.9.0', 'mposolda@redhat.com', 'META-INF/jpa-changelog-1.9.0.xml', '2025-10-14 20:48:32.16927', 23, 'EXECUTED', '9:bc3d0f9e823a69dc21e23e94c7a94bb1', 'update tableName=REALM; update tableName=REALM; update tableName=REALM; update tableName=REALM; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=REALM; update tableName=REALM; customChange; dr...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.9.1', 'keycloak', 'META-INF/jpa-changelog-1.9.1.xml', '2025-10-14 20:48:32.174369', 24, 'EXECUTED', '9:c9999da42f543575ab790e76439a2679', 'modifyDataType columnName=PRIVATE_KEY, tableName=REALM; modifyDataType columnName=PUBLIC_KEY, tableName=REALM; modifyDataType columnName=CERTIFICATE, tableName=REALM', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.9.1', 'keycloak', 'META-INF/db2-jpa-changelog-1.9.1.xml', '2025-10-14 20:48:32.176122', 25, 'MARK_RAN', '9:0d6c65c6f58732d81569e77b10ba301d', 'modifyDataType columnName=PRIVATE_KEY, tableName=REALM; modifyDataType columnName=CERTIFICATE, tableName=REALM', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('1.9.2', 'keycloak', 'META-INF/jpa-changelog-1.9.2.xml', '2025-10-14 20:48:32.46269', 26, 'EXECUTED', '9:fc576660fc016ae53d2d4778d84d86d0', 'createIndex indexName=IDX_USER_EMAIL, tableName=USER_ENTITY; createIndex indexName=IDX_USER_ROLE_MAPPING, tableName=USER_ROLE_MAPPING; createIndex indexName=IDX_USER_GROUP_MAPPING, tableName=USER_GROUP_MEMBERSHIP; createIndex indexName=IDX_USER_CO...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('authz-2.0.0', 'psilva@redhat.com', 'META-INF/jpa-changelog-authz-2.0.0.xml', '2025-10-14 20:48:32.533158', 27, 'EXECUTED', '9:43ed6b0da89ff77206289e87eaa9c024', 'createTable tableName=RESOURCE_SERVER; addPrimaryKey constraintName=CONSTRAINT_FARS, tableName=RESOURCE_SERVER; addUniqueConstraint constraintName=UK_AU8TT6T700S9V50BU18WS5HA6, tableName=RESOURCE_SERVER; createTable tableName=RESOURCE_SERVER_RESOU...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('authz-2.5.1', 'psilva@redhat.com', 'META-INF/jpa-changelog-authz-2.5.1.xml', '2025-10-14 20:48:32.536144', 28, 'EXECUTED', '9:44bae577f551b3738740281eceb4ea70', 'update tableName=RESOURCE_SERVER_POLICY', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('2.1.0-KEYCLOAK-5461', 'bburke@redhat.com', 'META-INF/jpa-changelog-2.1.0.xml', '2025-10-14 20:48:32.600029', 29, 'EXECUTED', '9:bd88e1f833df0420b01e114533aee5e8', 'createTable tableName=BROKER_LINK; createTable tableName=FED_USER_ATTRIBUTE; createTable tableName=FED_USER_CONSENT; createTable tableName=FED_USER_CONSENT_ROLE; createTable tableName=FED_USER_CONSENT_PROT_MAPPER; createTable tableName=FED_USER_CR...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('2.2.0', 'bburke@redhat.com', 'META-INF/jpa-changelog-2.2.0.xml', '2025-10-14 20:48:32.613115', 30, 'EXECUTED', '9:a7022af5267f019d020edfe316ef4371', 'addColumn tableName=ADMIN_EVENT_ENTITY; createTable tableName=CREDENTIAL_ATTRIBUTE; createTable tableName=FED_CREDENTIAL_ATTRIBUTE; modifyDataType columnName=VALUE, tableName=CREDENTIAL; addForeignKeyConstraint baseTableName=FED_CREDENTIAL_ATTRIBU...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('2.3.0', 'bburke@redhat.com', 'META-INF/jpa-changelog-2.3.0.xml', '2025-10-14 20:48:32.629144', 31, 'EXECUTED', '9:fc155c394040654d6a79227e56f5e25a', 'createTable tableName=FEDERATED_USER; addPrimaryKey constraintName=CONSTR_FEDERATED_USER, tableName=FEDERATED_USER; dropDefaultValue columnName=TOTP, tableName=USER_ENTITY; dropColumn columnName=TOTP, tableName=USER_ENTITY; addColumn tableName=IDE...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('2.4.0', 'bburke@redhat.com', 'META-INF/jpa-changelog-2.4.0.xml', '2025-10-14 20:48:32.633194', 32, 'EXECUTED', '9:eac4ffb2a14795e5dc7b426063e54d88', 'customChange', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('2.5.0', 'bburke@redhat.com', 'META-INF/jpa-changelog-2.5.0.xml', '2025-10-14 20:48:32.638095', 33, 'EXECUTED', '9:54937c05672568c4c64fc9524c1e9462', 'customChange; modifyDataType columnName=USER_ID, tableName=OFFLINE_USER_SESSION', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('2.5.0-unicode-oracle', 'hmlnarik@redhat.com', 'META-INF/jpa-changelog-2.5.0.xml', '2025-10-14 20:48:32.640073', 34, 'MARK_RAN', '9:f9753208029f582525ed12011a19d054', 'modifyDataType columnName=DESCRIPTION, tableName=AUTHENTICATION_FLOW; modifyDataType columnName=DESCRIPTION, tableName=CLIENT_TEMPLATE; modifyDataType columnName=DESCRIPTION, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=DESCRIPTION,...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('2.5.0-unicode-other-dbs', 'hmlnarik@redhat.com', 'META-INF/jpa-changelog-2.5.0.xml', '2025-10-14 20:48:32.663825', 35, 'EXECUTED', '9:33d72168746f81f98ae3a1e8e0ca3554', 'modifyDataType columnName=DESCRIPTION, tableName=AUTHENTICATION_FLOW; modifyDataType columnName=DESCRIPTION, tableName=CLIENT_TEMPLATE; modifyDataType columnName=DESCRIPTION, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=DESCRIPTION,...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('2.5.0-duplicate-email-support', 'slawomir@dabek.name', 'META-INF/jpa-changelog-2.5.0.xml', '2025-10-14 20:48:32.669009', 36, 'EXECUTED', '9:61b6d3d7a4c0e0024b0c839da283da0c', 'addColumn tableName=REALM', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('2.5.0-unique-group-names', 'hmlnarik@redhat.com', 'META-INF/jpa-changelog-2.5.0.xml', '2025-10-14 20:48:32.675067', 37, 'EXECUTED', '9:8dcac7bdf7378e7d823cdfddebf72fda', 'addUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('2.5.1', 'bburke@redhat.com', 'META-INF/jpa-changelog-2.5.1.xml', '2025-10-14 20:48:32.678774', 38, 'EXECUTED', '9:a2b870802540cb3faa72098db5388af3', 'addColumn tableName=FED_USER_CONSENT', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('3.0.0', 'bburke@redhat.com', 'META-INF/jpa-changelog-3.0.0.xml', '2025-10-14 20:48:32.682473', 39, 'EXECUTED', '9:132a67499ba24bcc54fb5cbdcfe7e4c0', 'addColumn tableName=IDENTITY_PROVIDER', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('3.2.0-fix', 'keycloak', 'META-INF/jpa-changelog-3.2.0.xml', '2025-10-14 20:48:32.684059', 40, 'MARK_RAN', '9:938f894c032f5430f2b0fafb1a243462', 'addNotNullConstraint columnName=REALM_ID, tableName=CLIENT_INITIAL_ACCESS', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('3.2.0-fix-with-keycloak-5416', 'keycloak', 'META-INF/jpa-changelog-3.2.0.xml', '2025-10-14 20:48:32.685957', 41, 'MARK_RAN', '9:845c332ff1874dc5d35974b0babf3006', 'dropIndex indexName=IDX_CLIENT_INIT_ACC_REALM, tableName=CLIENT_INITIAL_ACCESS; addNotNullConstraint columnName=REALM_ID, tableName=CLIENT_INITIAL_ACCESS; createIndex indexName=IDX_CLIENT_INIT_ACC_REALM, tableName=CLIENT_INITIAL_ACCESS', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('3.2.0-fix-offline-sessions', 'hmlnarik', 'META-INF/jpa-changelog-3.2.0.xml', '2025-10-14 20:48:32.689884', 42, 'EXECUTED', '9:fc86359c079781adc577c5a217e4d04c', 'customChange', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('3.2.0-fixed', 'keycloak', 'META-INF/jpa-changelog-3.2.0.xml', '2025-10-14 20:48:33.721777', 43, 'EXECUTED', '9:59a64800e3c0d09b825f8a3b444fa8f4', 'addColumn tableName=REALM; dropPrimaryKey constraintName=CONSTRAINT_OFFL_CL_SES_PK2, tableName=OFFLINE_CLIENT_SESSION; dropColumn columnName=CLIENT_SESSION_ID, tableName=OFFLINE_CLIENT_SESSION; addPrimaryKey constraintName=CONSTRAINT_OFFL_CL_SES_P...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('3.3.0', 'keycloak', 'META-INF/jpa-changelog-3.3.0.xml', '2025-10-14 20:48:33.726061', 44, 'EXECUTED', '9:d48d6da5c6ccf667807f633fe489ce88', 'addColumn tableName=USER_ENTITY', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('authz-3.4.0.CR1-resource-server-pk-change-part1', 'glavoie@gmail.com', 'META-INF/jpa-changelog-authz-3.4.0.CR1.xml', '2025-10-14 20:48:33.730351', 45, 'EXECUTED', '9:dde36f7973e80d71fceee683bc5d2951', 'addColumn tableName=RESOURCE_SERVER_POLICY; addColumn tableName=RESOURCE_SERVER_RESOURCE; addColumn tableName=RESOURCE_SERVER_SCOPE', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('authz-3.4.0.CR1-resource-server-pk-change-part2-KEYCLOAK-6095', 'hmlnarik@redhat.com', 'META-INF/jpa-changelog-authz-3.4.0.CR1.xml', '2025-10-14 20:48:33.734735', 46, 'EXECUTED', '9:b855e9b0a406b34fa323235a0cf4f640', 'customChange', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('authz-3.4.0.CR1-resource-server-pk-change-part3-fixed', 'glavoie@gmail.com', 'META-INF/jpa-changelog-authz-3.4.0.CR1.xml', '2025-10-14 20:48:33.736297', 47, 'MARK_RAN', '9:51abbacd7b416c50c4421a8cabf7927e', 'dropIndex indexName=IDX_RES_SERV_POL_RES_SERV, tableName=RESOURCE_SERVER_POLICY; dropIndex indexName=IDX_RES_SRV_RES_RES_SRV, tableName=RESOURCE_SERVER_RESOURCE; dropIndex indexName=IDX_RES_SRV_SCOPE_RES_SRV, tableName=RESOURCE_SERVER_SCOPE', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('authz-3.4.0.CR1-resource-server-pk-change-part3-fixed-nodropindex', 'glavoie@gmail.com', 'META-INF/jpa-changelog-authz-3.4.0.CR1.xml', '2025-10-14 20:48:33.829908', 48, 'EXECUTED', '9:bdc99e567b3398bac83263d375aad143', 'addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, tableName=RESOURCE_SERVER_POLICY; addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, tableName=RESOURCE_SERVER_RESOURCE; addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, ...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('authn-3.4.0.CR1-refresh-token-max-reuse', 'glavoie@gmail.com', 'META-INF/jpa-changelog-authz-3.4.0.CR1.xml', '2025-10-14 20:48:33.834208', 49, 'EXECUTED', '9:d198654156881c46bfba39abd7769e69', 'addColumn tableName=REALM', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('3.4.0', 'keycloak', 'META-INF/jpa-changelog-3.4.0.xml', '2025-10-14 20:48:33.880314', 50, 'EXECUTED', '9:cfdd8736332ccdd72c5256ccb42335db', 'addPrimaryKey constraintName=CONSTRAINT_REALM_DEFAULT_ROLES, tableName=REALM_DEFAULT_ROLES; addPrimaryKey constraintName=CONSTRAINT_COMPOSITE_ROLE, tableName=COMPOSITE_ROLE; addPrimaryKey constraintName=CONSTR_REALM_DEFAULT_GROUPS, tableName=REALM...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('3.4.0-KEYCLOAK-5230', 'hmlnarik@redhat.com', 'META-INF/jpa-changelog-3.4.0.xml', '2025-10-14 20:48:34.11044', 51, 'EXECUTED', '9:7c84de3d9bd84d7f077607c1a4dcb714', 'createIndex indexName=IDX_FU_ATTRIBUTE, tableName=FED_USER_ATTRIBUTE; createIndex indexName=IDX_FU_CONSENT, tableName=FED_USER_CONSENT; createIndex indexName=IDX_FU_CONSENT_RU, tableName=FED_USER_CONSENT; createIndex indexName=IDX_FU_CREDENTIAL, t...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('3.4.1', 'psilva@redhat.com', 'META-INF/jpa-changelog-3.4.1.xml', '2025-10-14 20:48:34.113973', 52, 'EXECUTED', '9:5a6bb36cbefb6a9d6928452c0852af2d', 'modifyDataType columnName=VALUE, tableName=CLIENT_ATTRIBUTES', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('3.4.2', 'keycloak', 'META-INF/jpa-changelog-3.4.2.xml', '2025-10-14 20:48:34.116649', 53, 'EXECUTED', '9:8f23e334dbc59f82e0a328373ca6ced0', 'update tableName=REALM', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('3.4.2-KEYCLOAK-5172', 'mkanis@redhat.com', 'META-INF/jpa-changelog-3.4.2.xml', '2025-10-14 20:48:34.119006', 54, 'EXECUTED', '9:9156214268f09d970cdf0e1564d866af', 'update tableName=CLIENT', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('4.0.0-KEYCLOAK-6335', 'bburke@redhat.com', 'META-INF/jpa-changelog-4.0.0.xml', '2025-10-14 20:48:34.125855', 55, 'EXECUTED', '9:db806613b1ed154826c02610b7dbdf74', 'createTable tableName=CLIENT_AUTH_FLOW_BINDINGS; addPrimaryKey constraintName=C_CLI_FLOW_BIND, tableName=CLIENT_AUTH_FLOW_BINDINGS', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('4.0.0-CLEANUP-UNUSED-TABLE', 'bburke@redhat.com', 'META-INF/jpa-changelog-4.0.0.xml', '2025-10-14 20:48:34.131247', 56, 'EXECUTED', '9:229a041fb72d5beac76bb94a5fa709de', 'dropTable tableName=CLIENT_IDENTITY_PROV_MAPPING', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('4.0.0-KEYCLOAK-6228', 'bburke@redhat.com', 'META-INF/jpa-changelog-4.0.0.xml', '2025-10-14 20:48:34.170386', 57, 'EXECUTED', '9:079899dade9c1e683f26b2aa9ca6ff04', 'dropUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHOGM8UEWRT, tableName=USER_CONSENT; dropNotNullConstraint columnName=CLIENT_ID, tableName=USER_CONSENT; addColumn tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHO...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('4.0.0-KEYCLOAK-5579-fixed', 'mposolda@redhat.com', 'META-INF/jpa-changelog-4.0.0.xml', '2025-10-14 20:48:34.442087', 58, 'EXECUTED', '9:139b79bcbbfe903bb1c2d2a4dbf001d9', 'dropForeignKeyConstraint baseTableName=CLIENT_TEMPLATE_ATTRIBUTES, constraintName=FK_CL_TEMPL_ATTR_TEMPL; renameTable newTableName=CLIENT_SCOPE_ATTRIBUTES, oldTableName=CLIENT_TEMPLATE_ATTRIBUTES; renameColumn newColumnName=SCOPE_ID, oldColumnName...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('authz-4.0.0.CR1', 'psilva@redhat.com', 'META-INF/jpa-changelog-authz-4.0.0.CR1.xml', '2025-10-14 20:48:34.46647', 59, 'EXECUTED', '9:b55738ad889860c625ba2bf483495a04', 'createTable tableName=RESOURCE_SERVER_PERM_TICKET; addPrimaryKey constraintName=CONSTRAINT_FAPMT, tableName=RESOURCE_SERVER_PERM_TICKET; addForeignKeyConstraint baseTableName=RESOURCE_SERVER_PERM_TICKET, constraintName=FK_FRSRHO213XCX4WNKOG82SSPMT...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('authz-4.0.0.Beta3', 'psilva@redhat.com', 'META-INF/jpa-changelog-authz-4.0.0.Beta3.xml', '2025-10-14 20:48:34.471638', 60, 'EXECUTED', '9:e0057eac39aa8fc8e09ac6cfa4ae15fe', 'addColumn tableName=RESOURCE_SERVER_POLICY; addColumn tableName=RESOURCE_SERVER_PERM_TICKET; addForeignKeyConstraint baseTableName=RESOURCE_SERVER_PERM_TICKET, constraintName=FK_FRSRPO2128CX4WNKOG82SSRFY, referencedTableName=RESOURCE_SERVER_POLICY', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('authz-4.2.0.Final', 'mhajas@redhat.com', 'META-INF/jpa-changelog-authz-4.2.0.Final.xml', '2025-10-14 20:48:34.47817', 61, 'EXECUTED', '9:42a33806f3a0443fe0e7feeec821326c', 'createTable tableName=RESOURCE_URIS; addForeignKeyConstraint baseTableName=RESOURCE_URIS, constraintName=FK_RESOURCE_SERVER_URIS, referencedTableName=RESOURCE_SERVER_RESOURCE; customChange; dropColumn columnName=URI, tableName=RESOURCE_SERVER_RESO...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('authz-4.2.0.Final-KEYCLOAK-9944', 'hmlnarik@redhat.com', 'META-INF/jpa-changelog-authz-4.2.0.Final.xml', '2025-10-14 20:48:34.484412', 62, 'EXECUTED', '9:9968206fca46eecc1f51db9c024bfe56', 'addPrimaryKey constraintName=CONSTRAINT_RESOUR_URIS_PK, tableName=RESOURCE_URIS', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('4.2.0-KEYCLOAK-6313', 'wadahiro@gmail.com', 'META-INF/jpa-changelog-4.2.0.xml', '2025-10-14 20:48:34.487994', 63, 'EXECUTED', '9:92143a6daea0a3f3b8f598c97ce55c3d', 'addColumn tableName=REQUIRED_ACTION_PROVIDER', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('4.3.0-KEYCLOAK-7984', 'wadahiro@gmail.com', 'META-INF/jpa-changelog-4.3.0.xml', '2025-10-14 20:48:34.493887', 64, 'EXECUTED', '9:82bab26a27195d889fb0429003b18f40', 'update tableName=REQUIRED_ACTION_PROVIDER', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('4.6.0-KEYCLOAK-7950', 'psilva@redhat.com', 'META-INF/jpa-changelog-4.6.0.xml', '2025-10-14 20:48:34.496278', 65, 'EXECUTED', '9:e590c88ddc0b38b0ae4249bbfcb5abc3', 'update tableName=RESOURCE_SERVER_RESOURCE', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('4.6.0-KEYCLOAK-8377', 'keycloak', 'META-INF/jpa-changelog-4.6.0.xml', '2025-10-14 20:48:34.527948', 66, 'EXECUTED', '9:5c1f475536118dbdc38d5d7977950cc0', 'createTable tableName=ROLE_ATTRIBUTE; addPrimaryKey constraintName=CONSTRAINT_ROLE_ATTRIBUTE_PK, tableName=ROLE_ATTRIBUTE; addForeignKeyConstraint baseTableName=ROLE_ATTRIBUTE, constraintName=FK_ROLE_ATTRIBUTE_ID, referencedTableName=KEYCLOAK_ROLE...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('4.6.0-KEYCLOAK-8555', 'gideonray@gmail.com', 'META-INF/jpa-changelog-4.6.0.xml', '2025-10-14 20:48:34.552823', 67, 'EXECUTED', '9:e7c9f5f9c4d67ccbbcc215440c718a17', 'createIndex indexName=IDX_COMPONENT_PROVIDER_TYPE, tableName=COMPONENT', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('4.7.0-KEYCLOAK-1267', 'sguilhen@redhat.com', 'META-INF/jpa-changelog-4.7.0.xml', '2025-10-14 20:48:34.5572', 68, 'EXECUTED', '9:88e0bfdda924690d6f4e430c53447dd5', 'addColumn tableName=REALM', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('4.7.0-KEYCLOAK-7275', 'keycloak', 'META-INF/jpa-changelog-4.7.0.xml', '2025-10-14 20:48:34.58428', 69, 'EXECUTED', '9:f53177f137e1c46b6a88c59ec1cb5218', 'renameColumn newColumnName=CREATED_ON, oldColumnName=LAST_SESSION_REFRESH, tableName=OFFLINE_USER_SESSION; addNotNullConstraint columnName=CREATED_ON, tableName=OFFLINE_USER_SESSION; addColumn tableName=OFFLINE_USER_SESSION; customChange; createIn...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('4.8.0-KEYCLOAK-8835', 'sguilhen@redhat.com', 'META-INF/jpa-changelog-4.8.0.xml', '2025-10-14 20:48:34.588933', 70, 'EXECUTED', '9:a74d33da4dc42a37ec27121580d1459f', 'addNotNullConstraint columnName=SSO_MAX_LIFESPAN_REMEMBER_ME, tableName=REALM; addNotNullConstraint columnName=SSO_IDLE_TIMEOUT_REMEMBER_ME, tableName=REALM', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('authz-7.0.0-KEYCLOAK-10443', 'psilva@redhat.com', 'META-INF/jpa-changelog-authz-7.0.0.xml', '2025-10-14 20:48:34.592787', 71, 'EXECUTED', '9:fd4ade7b90c3b67fae0bfcfcb42dfb5f', 'addColumn tableName=RESOURCE_SERVER', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('8.0.0-adding-credential-columns', 'keycloak', 'META-INF/jpa-changelog-8.0.0.xml', '2025-10-14 20:48:34.598323', 72, 'EXECUTED', '9:aa072ad090bbba210d8f18781b8cebf4', 'addColumn tableName=CREDENTIAL; addColumn tableName=FED_USER_CREDENTIAL', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('8.0.0-updating-credential-data-not-oracle-fixed', 'keycloak', 'META-INF/jpa-changelog-8.0.0.xml', '2025-10-14 20:48:34.603284', 73, 'EXECUTED', '9:1ae6be29bab7c2aa376f6983b932be37', 'update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('8.0.0-updating-credential-data-oracle-fixed', 'keycloak', 'META-INF/jpa-changelog-8.0.0.xml', '2025-10-14 20:48:34.605216', 74, 'MARK_RAN', '9:14706f286953fc9a25286dbd8fb30d97', 'update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('8.0.0-credential-cleanup-fixed', 'keycloak', 'META-INF/jpa-changelog-8.0.0.xml', '2025-10-14 20:48:34.620506', 75, 'EXECUTED', '9:2b9cc12779be32c5b40e2e67711a218b', 'dropDefaultValue columnName=COUNTER, tableName=CREDENTIAL; dropDefaultValue columnName=DIGITS, tableName=CREDENTIAL; dropDefaultValue columnName=PERIOD, tableName=CREDENTIAL; dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; dropColumn ...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('8.0.0-resource-tag-support', 'keycloak', 'META-INF/jpa-changelog-8.0.0.xml', '2025-10-14 20:48:34.645753', 76, 'EXECUTED', '9:91fa186ce7a5af127a2d7a91ee083cc5', 'addColumn tableName=MIGRATION_MODEL; createIndex indexName=IDX_UPDATE_TIME, tableName=MIGRATION_MODEL', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('9.0.0-always-display-client', 'keycloak', 'META-INF/jpa-changelog-9.0.0.xml', '2025-10-14 20:48:34.649637', 77, 'EXECUTED', '9:6335e5c94e83a2639ccd68dd24e2e5ad', 'addColumn tableName=CLIENT', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('9.0.0-drop-constraints-for-column-increase', 'keycloak', 'META-INF/jpa-changelog-9.0.0.xml', '2025-10-14 20:48:34.651269', 78, 'MARK_RAN', '9:6bdb5658951e028bfe16fa0a8228b530', 'dropUniqueConstraint constraintName=UK_FRSR6T700S9V50BU18WS5PMT, tableName=RESOURCE_SERVER_PERM_TICKET; dropUniqueConstraint constraintName=UK_FRSR6T700S9V50BU18WS5HA6, tableName=RESOURCE_SERVER_RESOURCE; dropPrimaryKey constraintName=CONSTRAINT_O...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('9.0.0-increase-column-size-federated-fk', 'keycloak', 'META-INF/jpa-changelog-9.0.0.xml', '2025-10-14 20:48:34.668151', 79, 'EXECUTED', '9:d5bc15a64117ccad481ce8792d4c608f', 'modifyDataType columnName=CLIENT_ID, tableName=FED_USER_CONSENT; modifyDataType columnName=CLIENT_REALM_CONSTRAINT, tableName=KEYCLOAK_ROLE; modifyDataType columnName=OWNER, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=CLIENT_ID, ta...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('9.0.0-recreate-constraints-after-column-increase', 'keycloak', 'META-INF/jpa-changelog-9.0.0.xml', '2025-10-14 20:48:34.66999', 80, 'MARK_RAN', '9:077cba51999515f4d3e7ad5619ab592c', 'addNotNullConstraint columnName=CLIENT_ID, tableName=OFFLINE_CLIENT_SESSION; addNotNullConstraint columnName=OWNER, tableName=RESOURCE_SERVER_PERM_TICKET; addNotNullConstraint columnName=REQUESTER, tableName=RESOURCE_SERVER_PERM_TICKET; addNotNull...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('9.0.1-add-index-to-client.client_id', 'keycloak', 'META-INF/jpa-changelog-9.0.1.xml', '2025-10-14 20:48:34.69458', 81, 'EXECUTED', '9:be969f08a163bf47c6b9e9ead8ac2afb', 'createIndex indexName=IDX_CLIENT_ID, tableName=CLIENT', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('9.0.1-KEYCLOAK-12579-drop-constraints', 'keycloak', 'META-INF/jpa-changelog-9.0.1.xml', '2025-10-14 20:48:34.696293', 82, 'MARK_RAN', '9:6d3bb4408ba5a72f39bd8a0b301ec6e3', 'dropUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('9.0.1-KEYCLOAK-12579-add-not-null-constraint', 'keycloak', 'META-INF/jpa-changelog-9.0.1.xml', '2025-10-14 20:48:34.700398', 83, 'EXECUTED', '9:966bda61e46bebf3cc39518fbed52fa7', 'addNotNullConstraint columnName=PARENT_GROUP, tableName=KEYCLOAK_GROUP', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('9.0.1-KEYCLOAK-12579-recreate-constraints', 'keycloak', 'META-INF/jpa-changelog-9.0.1.xml', '2025-10-14 20:48:34.701961', 84, 'MARK_RAN', '9:8dcac7bdf7378e7d823cdfddebf72fda', 'addUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('9.0.1-add-index-to-events', 'keycloak', 'META-INF/jpa-changelog-9.0.1.xml', '2025-10-14 20:48:34.726276', 85, 'EXECUTED', '9:7d93d602352a30c0c317e6a609b56599', 'createIndex indexName=IDX_EVENT_TIME, tableName=EVENT_ENTITY', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('map-remove-ri', 'keycloak', 'META-INF/jpa-changelog-11.0.0.xml', '2025-10-14 20:48:34.731063', 86, 'EXECUTED', '9:71c5969e6cdd8d7b6f47cebc86d37627', 'dropForeignKeyConstraint baseTableName=REALM, constraintName=FK_TRAF444KK6QRKMS7N56AIWQ5Y; dropForeignKeyConstraint baseTableName=KEYCLOAK_ROLE, constraintName=FK_KJHO5LE2C0RAL09FL8CM9WFW9', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('map-remove-ri', 'keycloak', 'META-INF/jpa-changelog-12.0.0.xml', '2025-10-14 20:48:34.738902', 87, 'EXECUTED', '9:a9ba7d47f065f041b7da856a81762021', 'dropForeignKeyConstraint baseTableName=REALM_DEFAULT_GROUPS, constraintName=FK_DEF_GROUPS_GROUP; dropForeignKeyConstraint baseTableName=REALM_DEFAULT_ROLES, constraintName=FK_H4WPD7W4HSOOLNI3H0SW7BTJE; dropForeignKeyConstraint baseTableName=CLIENT...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('12.1.0-add-realm-localization-table', 'keycloak', 'META-INF/jpa-changelog-12.0.0.xml', '2025-10-14 20:48:34.749438', 88, 'EXECUTED', '9:fffabce2bc01e1a8f5110d5278500065', 'createTable tableName=REALM_LOCALIZATIONS; addPrimaryKey tableName=REALM_LOCALIZATIONS', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('default-roles', 'keycloak', 'META-INF/jpa-changelog-13.0.0.xml', '2025-10-14 20:48:34.754358', 89, 'EXECUTED', '9:fa8a5b5445e3857f4b010bafb5009957', 'addColumn tableName=REALM; customChange', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('default-roles-cleanup', 'keycloak', 'META-INF/jpa-changelog-13.0.0.xml', '2025-10-14 20:48:34.76052', 90, 'EXECUTED', '9:67ac3241df9a8582d591c5ed87125f39', 'dropTable tableName=REALM_DEFAULT_ROLES; dropTable tableName=CLIENT_DEFAULT_ROLES', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('13.0.0-KEYCLOAK-16844', 'keycloak', 'META-INF/jpa-changelog-13.0.0.xml', '2025-10-14 20:48:34.790426', 91, 'EXECUTED', '9:ad1194d66c937e3ffc82386c050ba089', 'createIndex indexName=IDX_OFFLINE_USS_PRELOAD, tableName=OFFLINE_USER_SESSION', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('map-remove-ri-13.0.0', 'keycloak', 'META-INF/jpa-changelog-13.0.0.xml', '2025-10-14 20:48:34.798857', 92, 'EXECUTED', '9:d9be619d94af5a2f5d07b9f003543b91', 'dropForeignKeyConstraint baseTableName=DEFAULT_CLIENT_SCOPE, constraintName=FK_R_DEF_CLI_SCOPE_SCOPE; dropForeignKeyConstraint baseTableName=CLIENT_SCOPE_CLIENT, constraintName=FK_C_CLI_SCOPE_SCOPE; dropForeignKeyConstraint baseTableName=CLIENT_SC...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('13.0.0-KEYCLOAK-17992-drop-constraints', 'keycloak', 'META-INF/jpa-changelog-13.0.0.xml', '2025-10-14 20:48:34.800494', 93, 'MARK_RAN', '9:544d201116a0fcc5a5da0925fbbc3bde', 'dropPrimaryKey constraintName=C_CLI_SCOPE_BIND, tableName=CLIENT_SCOPE_CLIENT; dropIndex indexName=IDX_CLSCOPE_CL, tableName=CLIENT_SCOPE_CLIENT; dropIndex indexName=IDX_CL_CLSCOPE, tableName=CLIENT_SCOPE_CLIENT', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('13.0.0-increase-column-size-federated', 'keycloak', 'META-INF/jpa-changelog-13.0.0.xml', '2025-10-14 20:48:34.810065', 94, 'EXECUTED', '9:43c0c1055b6761b4b3e89de76d612ccf', 'modifyDataType columnName=CLIENT_ID, tableName=CLIENT_SCOPE_CLIENT; modifyDataType columnName=SCOPE_ID, tableName=CLIENT_SCOPE_CLIENT', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('13.0.0-KEYCLOAK-17992-recreate-constraints', 'keycloak', 'META-INF/jpa-changelog-13.0.0.xml', '2025-10-14 20:48:34.811777', 95, 'MARK_RAN', '9:8bd711fd0330f4fe980494ca43ab1139', 'addNotNullConstraint columnName=CLIENT_ID, tableName=CLIENT_SCOPE_CLIENT; addNotNullConstraint columnName=SCOPE_ID, tableName=CLIENT_SCOPE_CLIENT; addPrimaryKey constraintName=C_CLI_SCOPE_BIND, tableName=CLIENT_SCOPE_CLIENT; createIndex indexName=...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('json-string-accomodation-fixed', 'keycloak', 'META-INF/jpa-changelog-13.0.0.xml', '2025-10-14 20:48:34.819304', 96, 'EXECUTED', '9:e07d2bc0970c348bb06fb63b1f82ddbf', 'addColumn tableName=REALM_ATTRIBUTE; update tableName=REALM_ATTRIBUTE; dropColumn columnName=VALUE, tableName=REALM_ATTRIBUTE; renameColumn newColumnName=VALUE, oldColumnName=VALUE_NEW, tableName=REALM_ATTRIBUTE', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('14.0.0-KEYCLOAK-11019', 'keycloak', 'META-INF/jpa-changelog-14.0.0.xml', '2025-10-14 20:48:34.900746', 97, 'EXECUTED', '9:24fb8611e97f29989bea412aa38d12b7', 'createIndex indexName=IDX_OFFLINE_CSS_PRELOAD, tableName=OFFLINE_CLIENT_SESSION; createIndex indexName=IDX_OFFLINE_USS_BY_USER, tableName=OFFLINE_USER_SESSION; createIndex indexName=IDX_OFFLINE_USS_BY_USERSESS, tableName=OFFLINE_USER_SESSION', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('14.0.0-KEYCLOAK-18286', 'keycloak', 'META-INF/jpa-changelog-14.0.0.xml', '2025-10-14 20:48:34.902583', 98, 'MARK_RAN', '9:259f89014ce2506ee84740cbf7163aa7', 'createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('14.0.0-KEYCLOAK-18286-revert', 'keycloak', 'META-INF/jpa-changelog-14.0.0.xml', '2025-10-14 20:48:34.911155', 99, 'MARK_RAN', '9:04baaf56c116ed19951cbc2cca584022', 'dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('14.0.0-KEYCLOAK-18286-supported-dbs', 'keycloak', 'META-INF/jpa-changelog-14.0.0.xml', '2025-10-14 20:48:34.941035', 100, 'EXECUTED', '9:60ca84a0f8c94ec8c3504a5a3bc88ee8', 'createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('14.0.0-KEYCLOAK-18286-unsupported-dbs', 'keycloak', 'META-INF/jpa-changelog-14.0.0.xml', '2025-10-14 20:48:34.942917', 101, 'MARK_RAN', '9:d3d977031d431db16e2c181ce49d73e9', 'createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('KEYCLOAK-17267-add-index-to-user-attributes', 'keycloak', 'META-INF/jpa-changelog-14.0.0.xml', '2025-10-14 20:48:34.97349', 102, 'EXECUTED', '9:0b305d8d1277f3a89a0a53a659ad274c', 'createIndex indexName=IDX_USER_ATTRIBUTE_NAME, tableName=USER_ATTRIBUTE', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('KEYCLOAK-18146-add-saml-art-binding-identifier', 'keycloak', 'META-INF/jpa-changelog-14.0.0.xml', '2025-10-14 20:48:34.977098', 103, 'EXECUTED', '9:2c374ad2cdfe20e2905a84c8fac48460', 'customChange', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('15.0.0-KEYCLOAK-18467', 'keycloak', 'META-INF/jpa-changelog-15.0.0.xml', '2025-10-14 20:48:34.982158', 104, 'EXECUTED', '9:47a760639ac597360a8219f5b768b4de', 'addColumn tableName=REALM_LOCALIZATIONS; update tableName=REALM_LOCALIZATIONS; dropColumn columnName=TEXTS, tableName=REALM_LOCALIZATIONS; renameColumn newColumnName=TEXTS, oldColumnName=TEXTS_NEW, tableName=REALM_LOCALIZATIONS; addNotNullConstrai...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('17.0.0-9562', 'keycloak', 'META-INF/jpa-changelog-17.0.0.xml', '2025-10-14 20:48:35.00715', 105, 'EXECUTED', '9:a6272f0576727dd8cad2522335f5d99e', 'createIndex indexName=IDX_USER_SERVICE_ACCOUNT, tableName=USER_ENTITY', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('18.0.0-10625-IDX_ADMIN_EVENT_TIME', 'keycloak', 'META-INF/jpa-changelog-18.0.0.xml', '2025-10-14 20:48:35.031774', 106, 'EXECUTED', '9:015479dbd691d9cc8669282f4828c41d', 'createIndex indexName=IDX_ADMIN_EVENT_TIME, tableName=ADMIN_EVENT_ENTITY', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('18.0.15-30992-index-consent', 'keycloak', 'META-INF/jpa-changelog-18.0.15.xml', '2025-10-14 20:48:35.060401', 107, 'EXECUTED', '9:80071ede7a05604b1f4906f3bf3b00f0', 'createIndex indexName=IDX_USCONSENT_SCOPE_ID, tableName=USER_CONSENT_CLIENT_SCOPE', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('19.0.0-10135', 'keycloak', 'META-INF/jpa-changelog-19.0.0.xml', '2025-10-14 20:48:35.063768', 108, 'EXECUTED', '9:9518e495fdd22f78ad6425cc30630221', 'customChange', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('20.0.0-12964-supported-dbs', 'keycloak', 'META-INF/jpa-changelog-20.0.0.xml', '2025-10-14 20:48:35.088731', 109, 'EXECUTED', '9:e5f243877199fd96bcc842f27a1656ac', 'createIndex indexName=IDX_GROUP_ATT_BY_NAME_VALUE, tableName=GROUP_ATTRIBUTE', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('20.0.0-12964-supported-dbs-edb-migration', 'keycloak', 'META-INF/jpa-changelog-20.0.0.xml', '2025-10-14 20:48:35.118389', 110, 'EXECUTED', '9:a6b18a8e38062df5793edbe064f4aecd', 'dropIndex indexName=IDX_GROUP_ATT_BY_NAME_VALUE, tableName=GROUP_ATTRIBUTE; createIndex indexName=IDX_GROUP_ATT_BY_NAME_VALUE, tableName=GROUP_ATTRIBUTE', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('20.0.0-12964-unsupported-dbs', 'keycloak', 'META-INF/jpa-changelog-20.0.0.xml', '2025-10-14 20:48:35.120222', 111, 'MARK_RAN', '9:1a6fcaa85e20bdeae0a9ce49b41946a5', 'createIndex indexName=IDX_GROUP_ATT_BY_NAME_VALUE, tableName=GROUP_ATTRIBUTE', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('client-attributes-string-accomodation-fixed-pre-drop-index', 'keycloak', 'META-INF/jpa-changelog-20.0.0.xml', '2025-10-14 20:48:35.124268', 112, 'EXECUTED', '9:04baaf56c116ed19951cbc2cca584022', 'dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('client-attributes-string-accomodation-fixed', 'keycloak', 'META-INF/jpa-changelog-20.0.0.xml', '2025-10-14 20:48:35.129102', 113, 'EXECUTED', '9:3f332e13e90739ed0c35b0b25b7822ca', 'addColumn tableName=CLIENT_ATTRIBUTES; update tableName=CLIENT_ATTRIBUTES; dropColumn columnName=VALUE, tableName=CLIENT_ATTRIBUTES; renameColumn newColumnName=VALUE, oldColumnName=VALUE_NEW, tableName=CLIENT_ATTRIBUTES', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('client-attributes-string-accomodation-fixed-post-create-index', 'keycloak', 'META-INF/jpa-changelog-20.0.0.xml', '2025-10-14 20:48:35.131124', 114, 'MARK_RAN', '9:bd2bd0fc7768cf0845ac96a8786fa735', 'createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('21.0.2-17277', 'keycloak', 'META-INF/jpa-changelog-21.0.2.xml', '2025-10-14 20:48:35.13534', 115, 'EXECUTED', '9:7ee1f7a3fb8f5588f171fb9a6ab623c0', 'customChange', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('21.1.0-19404', 'keycloak', 'META-INF/jpa-changelog-21.1.0.xml', '2025-10-14 20:48:35.165787', 116, 'EXECUTED', '9:3d7e830b52f33676b9d64f7f2b2ea634', 'modifyDataType columnName=DECISION_STRATEGY, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=LOGIC, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=POLICY_ENFORCE_MODE, tableName=RESOURCE_SERVER', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('21.1.0-19404-2', 'keycloak', 'META-INF/jpa-changelog-21.1.0.xml', '2025-10-14 20:48:35.168304', 117, 'MARK_RAN', '9:627d032e3ef2c06c0e1f73d2ae25c26c', 'addColumn tableName=RESOURCE_SERVER_POLICY; update tableName=RESOURCE_SERVER_POLICY; dropColumn columnName=DECISION_STRATEGY, tableName=RESOURCE_SERVER_POLICY; renameColumn newColumnName=DECISION_STRATEGY, oldColumnName=DECISION_STRATEGY_NEW, tabl...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('22.0.0-17484-updated', 'keycloak', 'META-INF/jpa-changelog-22.0.0.xml', '2025-10-14 20:48:35.172015', 118, 'EXECUTED', '9:90af0bfd30cafc17b9f4d6eccd92b8b3', 'customChange', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('23.0.0-12062', 'keycloak', 'META-INF/jpa-changelog-23.0.0.xml', '2025-10-14 20:48:35.178539', 120, 'EXECUTED', '9:2168fbe728fec46ae9baf15bf80927b8', 'addColumn tableName=COMPONENT_CONFIG; update tableName=COMPONENT_CONFIG; dropColumn columnName=VALUE, tableName=COMPONENT_CONFIG; renameColumn newColumnName=VALUE, oldColumnName=VALUE_NEW, tableName=COMPONENT_CONFIG', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('23.0.0-17258', 'keycloak', 'META-INF/jpa-changelog-23.0.0.xml', '2025-10-14 20:48:35.182047', 121, 'EXECUTED', '9:36506d679a83bbfda85a27ea1864dca8', 'addColumn tableName=EVENT_ENTITY', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('24.0.0-9758', 'keycloak', 'META-INF/jpa-changelog-24.0.0.xml', '2025-10-14 20:48:35.272032', 122, 'EXECUTED', '9:502c557a5189f600f0f445a9b49ebbce', 'addColumn tableName=USER_ATTRIBUTE; addColumn tableName=FED_USER_ATTRIBUTE; createIndex indexName=USER_ATTR_LONG_VALUES, tableName=USER_ATTRIBUTE; createIndex indexName=FED_USER_ATTR_LONG_VALUES, tableName=FED_USER_ATTRIBUTE; createIndex indexName...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('24.0.0-9758-2', 'keycloak', 'META-INF/jpa-changelog-24.0.0.xml', '2025-10-14 20:48:35.275632', 123, 'EXECUTED', '9:bf0fdee10afdf597a987adbf291db7b2', 'customChange', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('24.0.0-26618-drop-index-if-present', 'keycloak', 'META-INF/jpa-changelog-24.0.0.xml', '2025-10-14 20:48:35.280511', 124, 'MARK_RAN', '9:04baaf56c116ed19951cbc2cca584022', 'dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('24.0.0-26618-reindex', 'keycloak', 'META-INF/jpa-changelog-24.0.0.xml', '2025-10-14 20:48:35.306981', 125, 'EXECUTED', '9:08707c0f0db1cef6b352db03a60edc7f', 'createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('24.0.0-26618-edb-migration', 'keycloak', 'META-INF/jpa-changelog-24.0.0.xml', '2025-10-14 20:48:35.338885', 126, 'EXECUTED', '9:2f684b29d414cd47efe3a3599f390741', 'dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES; createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('24.0.2-27228', 'keycloak', 'META-INF/jpa-changelog-24.0.2.xml', '2025-10-14 20:48:35.342758', 127, 'EXECUTED', '9:eaee11f6b8aa25d2cc6a84fb86fc6238', 'customChange', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('24.0.2-27967-drop-index-if-present', 'keycloak', 'META-INF/jpa-changelog-24.0.2.xml', '2025-10-14 20:48:35.34472', 128, 'MARK_RAN', '9:04baaf56c116ed19951cbc2cca584022', 'dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('24.0.2-27967-reindex', 'keycloak', 'META-INF/jpa-changelog-24.0.2.xml', '2025-10-14 20:48:35.346999', 129, 'MARK_RAN', '9:d3d977031d431db16e2c181ce49d73e9', 'createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('25.0.0-28265-tables', 'keycloak', 'META-INF/jpa-changelog-25.0.0.xml', '2025-10-14 20:48:35.35261', 130, 'EXECUTED', '9:deda2df035df23388af95bbd36c17cef', 'addColumn tableName=OFFLINE_USER_SESSION; addColumn tableName=OFFLINE_CLIENT_SESSION', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('25.0.0-28265-index-creation', 'keycloak', 'META-INF/jpa-changelog-25.0.0.xml', '2025-10-14 20:48:35.381939', 131, 'EXECUTED', '9:3e96709818458ae49f3c679ae58d263a', 'createIndex indexName=IDX_OFFLINE_USS_BY_LAST_SESSION_REFRESH, tableName=OFFLINE_USER_SESSION', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('25.0.0-28265-index-cleanup-uss-createdon', 'keycloak', 'META-INF/jpa-changelog-25.0.0.xml', '2025-10-14 20:48:35.390221', 132, 'EXECUTED', '9:78ab4fc129ed5e8265dbcc3485fba92f', 'dropIndex indexName=IDX_OFFLINE_USS_CREATEDON, tableName=OFFLINE_USER_SESSION', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('25.0.0-28265-index-cleanup-uss-preload', 'keycloak', 'META-INF/jpa-changelog-25.0.0.xml', '2025-10-14 20:48:35.397202', 133, 'EXECUTED', '9:de5f7c1f7e10994ed8b62e621d20eaab', 'dropIndex indexName=IDX_OFFLINE_USS_PRELOAD, tableName=OFFLINE_USER_SESSION', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('25.0.0-28265-index-cleanup-uss-by-usersess', 'keycloak', 'META-INF/jpa-changelog-25.0.0.xml', '2025-10-14 20:48:35.404352', 134, 'EXECUTED', '9:6eee220d024e38e89c799417ec33667f', 'dropIndex indexName=IDX_OFFLINE_USS_BY_USERSESS, tableName=OFFLINE_USER_SESSION', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('25.0.0-28265-index-cleanup-css-preload', 'keycloak', 'META-INF/jpa-changelog-25.0.0.xml', '2025-10-14 20:48:35.411443', 135, 'EXECUTED', '9:5411d2fb2891d3e8d63ddb55dfa3c0c9', 'dropIndex indexName=IDX_OFFLINE_CSS_PRELOAD, tableName=OFFLINE_CLIENT_SESSION', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('25.0.0-28265-index-2-mysql', 'keycloak', 'META-INF/jpa-changelog-25.0.0.xml', '2025-10-14 20:48:35.413397', 136, 'MARK_RAN', '9:b7ef76036d3126bb83c2423bf4d449d6', 'createIndex indexName=IDX_OFFLINE_USS_BY_BROKER_SESSION_ID, tableName=OFFLINE_USER_SESSION', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('25.0.0-28265-index-2-not-mysql', 'keycloak', 'META-INF/jpa-changelog-25.0.0.xml', '2025-10-14 20:48:35.439827', 137, 'EXECUTED', '9:23396cf51ab8bc1ae6f0cac7f9f6fcf7', 'createIndex indexName=IDX_OFFLINE_USS_BY_BROKER_SESSION_ID, tableName=OFFLINE_USER_SESSION', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('25.0.0-org', 'keycloak', 'META-INF/jpa-changelog-25.0.0.xml', '2025-10-14 20:48:35.462891', 138, 'EXECUTED', '9:5c859965c2c9b9c72136c360649af157', 'createTable tableName=ORG; addUniqueConstraint constraintName=UK_ORG_NAME, tableName=ORG; addUniqueConstraint constraintName=UK_ORG_GROUP, tableName=ORG; createTable tableName=ORG_DOMAIN', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('unique-consentuser', 'keycloak', 'META-INF/jpa-changelog-25.0.0.xml', '2025-10-14 20:48:35.474311', 139, 'EXECUTED', '9:5857626a2ea8767e9a6c66bf3a2cb32f', 'customChange; dropUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHOGM8UEWRT, tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_LOCAL_CONSENT, tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_EXTERNAL_CONSENT, tableName=...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('unique-consentuser-edb-migration', 'keycloak', 'META-INF/jpa-changelog-25.0.0.xml', '2025-10-14 20:48:35.481003', 140, 'MARK_RAN', '9:5857626a2ea8767e9a6c66bf3a2cb32f', 'customChange; dropUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHOGM8UEWRT, tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_LOCAL_CONSENT, tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_EXTERNAL_CONSENT, tableName=...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('unique-consentuser-mysql', 'keycloak', 'META-INF/jpa-changelog-25.0.0.xml', '2025-10-14 20:48:35.483363', 141, 'MARK_RAN', '9:b79478aad5adaa1bc428e31563f55e8e', 'customChange; dropUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHOGM8UEWRT, tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_LOCAL_CONSENT, tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_EXTERNAL_CONSENT, tableName=...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('25.0.0-28861-index-creation', 'keycloak', 'META-INF/jpa-changelog-25.0.0.xml', '2025-10-14 20:48:35.530624', 142, 'EXECUTED', '9:b9acb58ac958d9ada0fe12a5d4794ab1', 'createIndex indexName=IDX_PERM_TICKET_REQUESTER, tableName=RESOURCE_SERVER_PERM_TICKET; createIndex indexName=IDX_PERM_TICKET_OWNER, tableName=RESOURCE_SERVER_PERM_TICKET', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('26.0.0-org-alias', 'keycloak', 'META-INF/jpa-changelog-26.0.0.xml', '2025-10-14 20:48:35.538345', 143, 'EXECUTED', '9:6ef7d63e4412b3c2d66ed179159886a4', 'addColumn tableName=ORG; update tableName=ORG; addNotNullConstraint columnName=ALIAS, tableName=ORG; addUniqueConstraint constraintName=UK_ORG_ALIAS, tableName=ORG', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('26.0.0-org-group', 'keycloak', 'META-INF/jpa-changelog-26.0.0.xml', '2025-10-14 20:48:35.544174', 144, 'EXECUTED', '9:da8e8087d80ef2ace4f89d8c5b9ca223', 'addColumn tableName=KEYCLOAK_GROUP; update tableName=KEYCLOAK_GROUP; addNotNullConstraint columnName=TYPE, tableName=KEYCLOAK_GROUP; customChange', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('26.0.0-org-indexes', 'keycloak', 'META-INF/jpa-changelog-26.0.0.xml', '2025-10-14 20:48:35.568644', 145, 'EXECUTED', '9:79b05dcd610a8c7f25ec05135eec0857', 'createIndex indexName=IDX_ORG_DOMAIN_ORG_ID, tableName=ORG_DOMAIN', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('26.0.0-org-group-membership', 'keycloak', 'META-INF/jpa-changelog-26.0.0.xml', '2025-10-14 20:48:35.572896', 146, 'EXECUTED', '9:a6ace2ce583a421d89b01ba2a28dc2d4', 'addColumn tableName=USER_GROUP_MEMBERSHIP; update tableName=USER_GROUP_MEMBERSHIP; addNotNullConstraint columnName=MEMBERSHIP_TYPE, tableName=USER_GROUP_MEMBERSHIP', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('31296-persist-revoked-access-tokens', 'keycloak', 'META-INF/jpa-changelog-26.0.0.xml', '2025-10-14 20:48:35.579547', 147, 'EXECUTED', '9:64ef94489d42a358e8304b0e245f0ed4', 'createTable tableName=REVOKED_TOKEN; addPrimaryKey constraintName=CONSTRAINT_RT, tableName=REVOKED_TOKEN', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('31725-index-persist-revoked-access-tokens', 'keycloak', 'META-INF/jpa-changelog-26.0.0.xml', '2025-10-14 20:48:35.603998', 148, 'EXECUTED', '9:b994246ec2bf7c94da881e1d28782c7b', 'createIndex indexName=IDX_REV_TOKEN_ON_EXPIRE, tableName=REVOKED_TOKEN', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('26.0.0-idps-for-login', 'keycloak', 'META-INF/jpa-changelog-26.0.0.xml', '2025-10-14 20:48:35.653921', 149, 'EXECUTED', '9:51f5fffadf986983d4bd59582c6c1604', 'addColumn tableName=IDENTITY_PROVIDER; createIndex indexName=IDX_IDP_REALM_ORG, tableName=IDENTITY_PROVIDER; createIndex indexName=IDX_IDP_FOR_LOGIN, tableName=IDENTITY_PROVIDER; customChange', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('26.0.0-32583-drop-redundant-index-on-client-session', 'keycloak', 'META-INF/jpa-changelog-26.0.0.xml', '2025-10-14 20:48:35.66037', 150, 'EXECUTED', '9:24972d83bf27317a055d234187bb4af9', 'dropIndex indexName=IDX_US_SESS_ID_ON_CL_SESS, tableName=OFFLINE_CLIENT_SESSION', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('26.0.0.32582-remove-tables-user-session-user-session-note-and-client-session', 'keycloak', 'META-INF/jpa-changelog-26.0.0.xml', '2025-10-14 20:48:35.673711', 151, 'EXECUTED', '9:febdc0f47f2ed241c59e60f58c3ceea5', 'dropTable tableName=CLIENT_SESSION_ROLE; dropTable tableName=CLIENT_SESSION_NOTE; dropTable tableName=CLIENT_SESSION_PROT_MAPPER; dropTable tableName=CLIENT_SESSION_AUTH_STATUS; dropTable tableName=CLIENT_USER_SESSION_NOTE; dropTable tableName=CLI...', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('26.0.0-33201-org-redirect-url', 'keycloak', 'META-INF/jpa-changelog-26.0.0.xml', '2025-10-14 20:48:35.677167', 152, 'EXECUTED', '9:4d0e22b0ac68ebe9794fa9cb752ea660', 'addColumn tableName=ORG', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('29399-jdbc-ping-default', 'keycloak', 'META-INF/jpa-changelog-26.1.0.xml', '2025-10-14 20:48:35.687269', 153, 'EXECUTED', '9:007dbe99d7203fca403b89d4edfdf21e', 'createTable tableName=JGROUPS_PING; addPrimaryKey constraintName=CONSTRAINT_JGROUPS_PING, tableName=JGROUPS_PING', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('26.1.0-34013', 'keycloak', 'META-INF/jpa-changelog-26.1.0.xml', '2025-10-14 20:48:35.692317', 154, 'EXECUTED', '9:e6b686a15759aef99a6d758a5c4c6a26', 'addColumn tableName=ADMIN_EVENT_ENTITY', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('26.1.0-34380', 'keycloak', 'META-INF/jpa-changelog-26.1.0.xml', '2025-10-14 20:48:35.696618', 155, 'EXECUTED', '9:ac8b9edb7c2b6c17a1c7a11fcf5ccf01', 'dropTable tableName=USERNAME_LOGIN_FAILURE', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('26.2.0-36750', 'keycloak', 'META-INF/jpa-changelog-26.2.0.xml', '2025-10-14 20:48:35.707914', 156, 'EXECUTED', '9:b49ce951c22f7eb16480ff085640a33a', 'createTable tableName=SERVER_CONFIG', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('26.2.0-26106', 'keycloak', 'META-INF/jpa-changelog-26.2.0.xml', '2025-10-14 20:48:35.7119', 157, 'EXECUTED', '9:b5877d5dab7d10ff3a9d209d7beb6680', 'addColumn tableName=CREDENTIAL', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('26.2.6-39866-duplicate', 'keycloak', 'META-INF/jpa-changelog-26.2.6.xml', '2025-10-14 20:48:35.71567', 158, 'EXECUTED', '9:1dc67ccee24f30331db2cba4f372e40e', 'customChange', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('26.2.6-39866-uk', 'keycloak', 'META-INF/jpa-changelog-26.2.6.xml', '2025-10-14 20:48:35.722864', 159, 'EXECUTED', '9:b70b76f47210cf0a5f4ef0e219eac7cd', 'addUniqueConstraint constraintName=UK_MIGRATION_VERSION, tableName=MIGRATION_MODEL', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('26.2.6-40088-duplicate', 'keycloak', 'META-INF/jpa-changelog-26.2.6.xml', '2025-10-14 20:48:35.726647', 160, 'EXECUTED', '9:cc7e02ed69ab31979afb1982f9670e8f', 'customChange', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('26.2.6-40088-uk', 'keycloak', 'META-INF/jpa-changelog-26.2.6.xml', '2025-10-14 20:48:35.733478', 161, 'EXECUTED', '9:5bb848128da7bc4595cc507383325241', 'addUniqueConstraint constraintName=UK_MIGRATION_UPDATE_TIME, tableName=MIGRATION_MODEL', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('26.3.0-groups-description', 'keycloak', 'META-INF/jpa-changelog-26.3.0.xml', '2025-10-14 20:48:35.740339', 162, 'EXECUTED', '9:e1a3c05574326fb5b246b73b9a4c4d49', 'addColumn tableName=KEYCLOAK_GROUP', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('26.4.0-40933-saml-encryption-attributes', 'keycloak', 'META-INF/jpa-changelog-26.4.0.xml', '2025-10-14 20:48:35.743881', 163, 'EXECUTED', '9:7e9eaba362ca105efdda202303a4fe49', 'customChange', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('26.4.0-51321', 'keycloak', 'META-INF/jpa-changelog-26.4.0.xml', '2025-10-14 20:48:35.771726', 164, 'EXECUTED', '9:34bab2bc56f75ffd7e347c580874e306', 'createIndex indexName=IDX_EVENT_ENTITY_USER_ID_TYPE, tableName=EVENT_ENTITY', '', NULL, '4.33.0', NULL, NULL, '0474907663');
INSERT INTO public.databasechangelog VALUES ('40343-workflow-state-table', 'keycloak', 'META-INF/jpa-changelog-26.4.0.xml', '2025-10-14 20:48:35.824803', 165, 'EXECUTED', '9:ed3ab4723ceed210e5b5e60ac4562106', 'createTable tableName=WORKFLOW_STATE; addPrimaryKey constraintName=PK_WORKFLOW_STATE, tableName=WORKFLOW_STATE; addUniqueConstraint constraintName=UQ_WORKFLOW_RESOURCE, tableName=WORKFLOW_STATE; createIndex indexName=IDX_WORKFLOW_STATE_STEP, table...', '', NULL, '4.33.0', NULL, NULL, '0474907663');


--
-- TOC entry 4232 (class 0 OID 16493)
-- Dependencies: 235
-- Data for Name: databasechangeloglock; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.databasechangeloglock VALUES (1, false, NULL, NULL);
INSERT INTO public.databasechangeloglock VALUES (1000, false, NULL, NULL);


--
-- TOC entry 4233 (class 0 OID 16496)
-- Dependencies: 236
-- Data for Name: default_client_scope; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.default_client_scope VALUES ('0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'e0494fe5-b7de-45d8-bb95-af39b1cc1ffc', false);
INSERT INTO public.default_client_scope VALUES ('0666ea4e-c88f-4e30-bf74-4874c0b2484d', '58e46e1a-cc0e-4fd2-980a-4c77088f7e35', true);
INSERT INTO public.default_client_scope VALUES ('0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'fd9493c9-59f4-4a84-a97b-9b0b8ecd942f', true);
INSERT INTO public.default_client_scope VALUES ('0666ea4e-c88f-4e30-bf74-4874c0b2484d', '62575e76-6395-4763-8bef-09e8e8d59993', true);
INSERT INTO public.default_client_scope VALUES ('0666ea4e-c88f-4e30-bf74-4874c0b2484d', '593c1616-ca62-42db-94eb-f3c5487a52da', true);
INSERT INTO public.default_client_scope VALUES ('0666ea4e-c88f-4e30-bf74-4874c0b2484d', '688617ce-f549-4120-a885-33b3dfae6282', false);
INSERT INTO public.default_client_scope VALUES ('0666ea4e-c88f-4e30-bf74-4874c0b2484d', '68d40b24-a216-4a20-84b6-81420d7a0c95', false);
INSERT INTO public.default_client_scope VALUES ('0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'c5eed9dc-700f-4362-8804-04f04da04765', true);
INSERT INTO public.default_client_scope VALUES ('0666ea4e-c88f-4e30-bf74-4874c0b2484d', '62f74fe4-018f-4b9a-bbc3-cfdd9e1fb856', true);
INSERT INTO public.default_client_scope VALUES ('0666ea4e-c88f-4e30-bf74-4874c0b2484d', '96bb40cf-535c-4937-ae0f-0c913bf5952f', false);
INSERT INTO public.default_client_scope VALUES ('0666ea4e-c88f-4e30-bf74-4874c0b2484d', '01a2c8df-abd8-444c-8e7f-61d62c869545', true);
INSERT INTO public.default_client_scope VALUES ('0666ea4e-c88f-4e30-bf74-4874c0b2484d', '7e8f2efc-a69f-4c37-940d-aabff960c64b', true);
INSERT INTO public.default_client_scope VALUES ('0666ea4e-c88f-4e30-bf74-4874c0b2484d', '354e93d1-efa3-497f-984f-8d4a0a76c2a6', false);
INSERT INTO public.default_client_scope VALUES ('000c9ecc-9c3a-44d3-94fe-941ff152490f', 'f8e4d1e8-7103-4704-97a3-1ee62aa86660', false);
INSERT INTO public.default_client_scope VALUES ('000c9ecc-9c3a-44d3-94fe-941ff152490f', '4dc9be4d-e7bc-48ec-8bd8-d2568f39b002', true);
INSERT INTO public.default_client_scope VALUES ('000c9ecc-9c3a-44d3-94fe-941ff152490f', 'ee632a6d-6ac6-47d5-8230-999b1a477a3a', true);
INSERT INTO public.default_client_scope VALUES ('000c9ecc-9c3a-44d3-94fe-941ff152490f', 'ac19754b-388f-4693-98be-d848d089fd01', true);
INSERT INTO public.default_client_scope VALUES ('000c9ecc-9c3a-44d3-94fe-941ff152490f', 'a1fff042-318c-4d6e-9aa1-c8c20bd59868', true);
INSERT INTO public.default_client_scope VALUES ('000c9ecc-9c3a-44d3-94fe-941ff152490f', '7b1c264b-9d0c-4b3b-b16e-69fc224d9f7f', false);
INSERT INTO public.default_client_scope VALUES ('000c9ecc-9c3a-44d3-94fe-941ff152490f', '18650c31-3ce4-4b1e-8f73-875ae273569d', false);
INSERT INTO public.default_client_scope VALUES ('000c9ecc-9c3a-44d3-94fe-941ff152490f', 'a8acc800-a1e6-442a-b50f-b4a7d4b72fb5', true);
INSERT INTO public.default_client_scope VALUES ('000c9ecc-9c3a-44d3-94fe-941ff152490f', 'bf3b4f1d-f637-4455-ace8-25e492d59f36', true);
INSERT INTO public.default_client_scope VALUES ('000c9ecc-9c3a-44d3-94fe-941ff152490f', '748440bd-2511-49b1-911a-d7358db20a62', false);
INSERT INTO public.default_client_scope VALUES ('000c9ecc-9c3a-44d3-94fe-941ff152490f', 'b7a462eb-095f-4d94-b789-fe46b3c02b37', true);
INSERT INTO public.default_client_scope VALUES ('000c9ecc-9c3a-44d3-94fe-941ff152490f', 'a63914be-3f59-4780-98f4-ed55a3bb4d1e', true);
INSERT INTO public.default_client_scope VALUES ('000c9ecc-9c3a-44d3-94fe-941ff152490f', '0f21e46c-0abc-44e7-b9c5-2da49b32e298', false);


--
-- TOC entry 4234 (class 0 OID 16500)
-- Dependencies: 237
-- Data for Name: event_entity; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4235 (class 0 OID 16505)
-- Dependencies: 238
-- Data for Name: fed_user_attribute; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4236 (class 0 OID 16510)
-- Dependencies: 239
-- Data for Name: fed_user_consent; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4237 (class 0 OID 16515)
-- Dependencies: 240
-- Data for Name: fed_user_consent_cl_scope; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4238 (class 0 OID 16518)
-- Dependencies: 241
-- Data for Name: fed_user_credential; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4239 (class 0 OID 16523)
-- Dependencies: 242
-- Data for Name: fed_user_group_membership; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4240 (class 0 OID 16526)
-- Dependencies: 243
-- Data for Name: fed_user_required_action; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4241 (class 0 OID 16532)
-- Dependencies: 244
-- Data for Name: fed_user_role_mapping; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4242 (class 0 OID 16535)
-- Dependencies: 245
-- Data for Name: federated_identity; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4243 (class 0 OID 16540)
-- Dependencies: 246
-- Data for Name: federated_user; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4244 (class 0 OID 16545)
-- Dependencies: 247
-- Data for Name: group_attribute; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4245 (class 0 OID 16551)
-- Dependencies: 248
-- Data for Name: group_role_mapping; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.group_role_mapping VALUES ('e0d10597-bf56-4ce3-8d60-fcc45260c6b6', 'ea0097c4-3325-494e-904b-ef6fef8c9ddb');
INSERT INTO public.group_role_mapping VALUES ('8a963c36-ca66-45f9-af62-ce439801f0d3', 'caf0000d-bab0-4414-9096-2430000ac9b1');
INSERT INTO public.group_role_mapping VALUES ('50808e75-e563-4c76-9f0b-b6e8dcce4553', '0a9fda05-f683-4ad3-bf5c-e5000da2ee6a');


--
-- TOC entry 4246 (class 0 OID 16554)
-- Dependencies: 249
-- Data for Name: identity_provider; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4247 (class 0 OID 16566)
-- Dependencies: 250
-- Data for Name: identity_provider_config; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4248 (class 0 OID 16571)
-- Dependencies: 251
-- Data for Name: identity_provider_mapper; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4249 (class 0 OID 16576)
-- Dependencies: 252
-- Data for Name: idp_mapper_config; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4250 (class 0 OID 16581)
-- Dependencies: 253
-- Data for Name: jgroups_ping; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4251 (class 0 OID 16586)
-- Dependencies: 254
-- Data for Name: keycloak_group; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.keycloak_group VALUES ('ea0097c4-3325-494e-904b-ef6fef8c9ddb', 'teachers', ' ', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 0, '');
INSERT INTO public.keycloak_group VALUES ('0a9fda05-f683-4ad3-bf5c-e5000da2ee6a', 'admins', ' ', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 0, '');
INSERT INTO public.keycloak_group VALUES ('caf0000d-bab0-4414-9096-2430000ac9b1', 'students', ' ', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 0, '');


--
-- TOC entry 4252 (class 0 OID 16592)
-- Dependencies: 255
-- Data for Name: keycloak_role; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.keycloak_role VALUES ('83d02c9a-4d21-4e86-b3a5-c4772f85ec6a', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', false, '${role_default-roles}', 'default-roles-master', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', NULL, NULL);
INSERT INTO public.keycloak_role VALUES ('b2132454-dffa-40df-838e-3e33b208644f', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', false, '${role_create-realm}', 'create-realm', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', NULL, NULL);
INSERT INTO public.keycloak_role VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', false, '${role_admin}', 'admin', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', NULL, NULL);
INSERT INTO public.keycloak_role VALUES ('d6212e65-08f9-485f-9c21-b4edcc3c9fc7', 'fc8ba69a-482f-4900-90ad-721fe89f195f', true, '${role_create-client}', 'create-client', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'fc8ba69a-482f-4900-90ad-721fe89f195f', NULL);
INSERT INTO public.keycloak_role VALUES ('70cd2784-d68e-4e35-9484-b6dcd23efd61', 'fc8ba69a-482f-4900-90ad-721fe89f195f', true, '${role_view-realm}', 'view-realm', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'fc8ba69a-482f-4900-90ad-721fe89f195f', NULL);
INSERT INTO public.keycloak_role VALUES ('184274b4-465f-488e-a749-0e637b189160', 'fc8ba69a-482f-4900-90ad-721fe89f195f', true, '${role_view-users}', 'view-users', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'fc8ba69a-482f-4900-90ad-721fe89f195f', NULL);
INSERT INTO public.keycloak_role VALUES ('cae3c546-c55a-461d-935b-4be9d51908e6', 'fc8ba69a-482f-4900-90ad-721fe89f195f', true, '${role_view-clients}', 'view-clients', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'fc8ba69a-482f-4900-90ad-721fe89f195f', NULL);
INSERT INTO public.keycloak_role VALUES ('ce317b98-57bd-42a3-9c5c-9e7cfa251ffe', 'fc8ba69a-482f-4900-90ad-721fe89f195f', true, '${role_view-events}', 'view-events', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'fc8ba69a-482f-4900-90ad-721fe89f195f', NULL);
INSERT INTO public.keycloak_role VALUES ('86ac1f47-c9c3-496f-ac21-085e5c3f3eb8', 'fc8ba69a-482f-4900-90ad-721fe89f195f', true, '${role_view-identity-providers}', 'view-identity-providers', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'fc8ba69a-482f-4900-90ad-721fe89f195f', NULL);
INSERT INTO public.keycloak_role VALUES ('a3c1321a-81aa-4c38-9457-0fc0e6aaa38f', 'fc8ba69a-482f-4900-90ad-721fe89f195f', true, '${role_view-authorization}', 'view-authorization', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'fc8ba69a-482f-4900-90ad-721fe89f195f', NULL);
INSERT INTO public.keycloak_role VALUES ('ca9bb414-b703-46f3-8e7d-4a51c3737765', 'fc8ba69a-482f-4900-90ad-721fe89f195f', true, '${role_manage-realm}', 'manage-realm', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'fc8ba69a-482f-4900-90ad-721fe89f195f', NULL);
INSERT INTO public.keycloak_role VALUES ('b048a423-d753-4aab-96d2-7ccd2c95df3c', 'fc8ba69a-482f-4900-90ad-721fe89f195f', true, '${role_manage-users}', 'manage-users', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'fc8ba69a-482f-4900-90ad-721fe89f195f', NULL);
INSERT INTO public.keycloak_role VALUES ('aec83f14-d848-4342-8baf-0d3315d64503', 'fc8ba69a-482f-4900-90ad-721fe89f195f', true, '${role_manage-clients}', 'manage-clients', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'fc8ba69a-482f-4900-90ad-721fe89f195f', NULL);
INSERT INTO public.keycloak_role VALUES ('938bcef4-4540-4c66-9ee2-77cfabca87b6', 'fc8ba69a-482f-4900-90ad-721fe89f195f', true, '${role_manage-events}', 'manage-events', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'fc8ba69a-482f-4900-90ad-721fe89f195f', NULL);
INSERT INTO public.keycloak_role VALUES ('398283d5-3e77-4fcc-aa45-3b230886f441', 'fc8ba69a-482f-4900-90ad-721fe89f195f', true, '${role_manage-identity-providers}', 'manage-identity-providers', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'fc8ba69a-482f-4900-90ad-721fe89f195f', NULL);
INSERT INTO public.keycloak_role VALUES ('039eb199-78d8-4477-808f-cb22d297afce', 'fc8ba69a-482f-4900-90ad-721fe89f195f', true, '${role_manage-authorization}', 'manage-authorization', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'fc8ba69a-482f-4900-90ad-721fe89f195f', NULL);
INSERT INTO public.keycloak_role VALUES ('b2ff4369-7e5f-4f20-aef4-2764ddeaa3e4', 'fc8ba69a-482f-4900-90ad-721fe89f195f', true, '${role_query-users}', 'query-users', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'fc8ba69a-482f-4900-90ad-721fe89f195f', NULL);
INSERT INTO public.keycloak_role VALUES ('24553704-44e0-471d-b658-08468aa95a9b', 'fc8ba69a-482f-4900-90ad-721fe89f195f', true, '${role_query-clients}', 'query-clients', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'fc8ba69a-482f-4900-90ad-721fe89f195f', NULL);
INSERT INTO public.keycloak_role VALUES ('9ba15469-de14-41f9-bcd1-414eb48e1a9b', 'fc8ba69a-482f-4900-90ad-721fe89f195f', true, '${role_query-realms}', 'query-realms', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'fc8ba69a-482f-4900-90ad-721fe89f195f', NULL);
INSERT INTO public.keycloak_role VALUES ('f84e5f2a-426c-480c-af6c-a761651fe8e6', 'fc8ba69a-482f-4900-90ad-721fe89f195f', true, '${role_query-groups}', 'query-groups', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'fc8ba69a-482f-4900-90ad-721fe89f195f', NULL);
INSERT INTO public.keycloak_role VALUES ('d8ded547-7d41-45e7-8b23-afdffccd6b3d', '0b148250-d1c8-45d5-836c-b324e24f2f58', true, '${role_view-profile}', 'view-profile', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '0b148250-d1c8-45d5-836c-b324e24f2f58', NULL);
INSERT INTO public.keycloak_role VALUES ('b95c529b-ef8d-44f5-bd1f-47086213315b', '0b148250-d1c8-45d5-836c-b324e24f2f58', true, '${role_manage-account}', 'manage-account', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '0b148250-d1c8-45d5-836c-b324e24f2f58', NULL);
INSERT INTO public.keycloak_role VALUES ('82e8e12e-0fea-4e53-928d-bf2bf3dbbfb0', '0b148250-d1c8-45d5-836c-b324e24f2f58', true, '${role_manage-account-links}', 'manage-account-links', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '0b148250-d1c8-45d5-836c-b324e24f2f58', NULL);
INSERT INTO public.keycloak_role VALUES ('6ecee205-0556-4b16-821b-7b7966ff5aa3', '0b148250-d1c8-45d5-836c-b324e24f2f58', true, '${role_view-applications}', 'view-applications', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '0b148250-d1c8-45d5-836c-b324e24f2f58', NULL);
INSERT INTO public.keycloak_role VALUES ('6792f9a3-3403-4275-8837-0d545d88f733', '0b148250-d1c8-45d5-836c-b324e24f2f58', true, '${role_view-consent}', 'view-consent', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '0b148250-d1c8-45d5-836c-b324e24f2f58', NULL);
INSERT INTO public.keycloak_role VALUES ('252664c3-be38-45a1-9b54-4aab298efebb', '0b148250-d1c8-45d5-836c-b324e24f2f58', true, '${role_manage-consent}', 'manage-consent', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '0b148250-d1c8-45d5-836c-b324e24f2f58', NULL);
INSERT INTO public.keycloak_role VALUES ('7d606dfa-83ae-4fd6-b145-669374409aeb', '0b148250-d1c8-45d5-836c-b324e24f2f58', true, '${role_view-groups}', 'view-groups', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '0b148250-d1c8-45d5-836c-b324e24f2f58', NULL);
INSERT INTO public.keycloak_role VALUES ('408d0cfa-f8ce-4c05-ba7f-dec9bd2f4e96', '0b148250-d1c8-45d5-836c-b324e24f2f58', true, '${role_delete-account}', 'delete-account', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '0b148250-d1c8-45d5-836c-b324e24f2f58', NULL);
INSERT INTO public.keycloak_role VALUES ('5c6c5f60-bb29-49d0-b151-51fdb8306e49', '855e27ee-2639-4633-9417-1649ff1d8ab7', true, '${role_read-token}', 'read-token', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '855e27ee-2639-4633-9417-1649ff1d8ab7', NULL);
INSERT INTO public.keycloak_role VALUES ('b04d8676-b711-42ec-bc86-ceed0bd5d485', 'fc8ba69a-482f-4900-90ad-721fe89f195f', true, '${role_impersonation}', 'impersonation', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'fc8ba69a-482f-4900-90ad-721fe89f195f', NULL);
INSERT INTO public.keycloak_role VALUES ('a0219b69-16e6-4455-a1ac-f04e2a236a21', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', false, '${role_offline-access}', 'offline_access', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', NULL, NULL);
INSERT INTO public.keycloak_role VALUES ('a094f044-1586-4448-b116-3d30223d17fb', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', false, '${role_uma_authorization}', 'uma_authorization', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', NULL, NULL);
INSERT INTO public.keycloak_role VALUES ('0fc1515d-32eb-4643-b9e9-646337839092', '000c9ecc-9c3a-44d3-94fe-941ff152490f', false, '${role_default-roles}', 'default-roles-alumnet-realm', '000c9ecc-9c3a-44d3-94fe-941ff152490f', NULL, NULL);
INSERT INTO public.keycloak_role VALUES ('94b1c888-87d1-42d7-800e-394728dff586', 'd6950149-318e-4aa6-b269-0054a67501d6', true, '${role_create-client}', 'create-client', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'd6950149-318e-4aa6-b269-0054a67501d6', NULL);
INSERT INTO public.keycloak_role VALUES ('8306760f-c0b3-4469-bedd-9c5fe077bb9d', 'd6950149-318e-4aa6-b269-0054a67501d6', true, '${role_view-realm}', 'view-realm', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'd6950149-318e-4aa6-b269-0054a67501d6', NULL);
INSERT INTO public.keycloak_role VALUES ('8bc720dc-4b8f-4d3a-83ff-925e52e7e6a9', 'd6950149-318e-4aa6-b269-0054a67501d6', true, '${role_view-users}', 'view-users', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'd6950149-318e-4aa6-b269-0054a67501d6', NULL);
INSERT INTO public.keycloak_role VALUES ('610438f2-3ea4-4429-b731-d60216d7f238', 'd6950149-318e-4aa6-b269-0054a67501d6', true, '${role_view-clients}', 'view-clients', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'd6950149-318e-4aa6-b269-0054a67501d6', NULL);
INSERT INTO public.keycloak_role VALUES ('6e79f3fa-e216-4384-bdc3-9ce95fce8b14', 'd6950149-318e-4aa6-b269-0054a67501d6', true, '${role_view-events}', 'view-events', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'd6950149-318e-4aa6-b269-0054a67501d6', NULL);
INSERT INTO public.keycloak_role VALUES ('ff586ac2-3b94-4487-8bb8-63d98dbb16b3', 'd6950149-318e-4aa6-b269-0054a67501d6', true, '${role_view-identity-providers}', 'view-identity-providers', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'd6950149-318e-4aa6-b269-0054a67501d6', NULL);
INSERT INTO public.keycloak_role VALUES ('e41b30e3-875e-4a6c-8d39-2a32ae06d63b', 'd6950149-318e-4aa6-b269-0054a67501d6', true, '${role_view-authorization}', 'view-authorization', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'd6950149-318e-4aa6-b269-0054a67501d6', NULL);
INSERT INTO public.keycloak_role VALUES ('e195f23a-b529-42d7-af77-64e73199f801', 'd6950149-318e-4aa6-b269-0054a67501d6', true, '${role_manage-realm}', 'manage-realm', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'd6950149-318e-4aa6-b269-0054a67501d6', NULL);
INSERT INTO public.keycloak_role VALUES ('a8be5c2f-be83-41b8-9cb9-f35cc4ee82a1', 'd6950149-318e-4aa6-b269-0054a67501d6', true, '${role_manage-users}', 'manage-users', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'd6950149-318e-4aa6-b269-0054a67501d6', NULL);
INSERT INTO public.keycloak_role VALUES ('274ab78e-1f1f-40bc-8e10-5458e91db17b', 'd6950149-318e-4aa6-b269-0054a67501d6', true, '${role_manage-clients}', 'manage-clients', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'd6950149-318e-4aa6-b269-0054a67501d6', NULL);
INSERT INTO public.keycloak_role VALUES ('3d7dc8fc-820b-44bd-9b75-d39b972ef2b9', 'd6950149-318e-4aa6-b269-0054a67501d6', true, '${role_manage-events}', 'manage-events', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'd6950149-318e-4aa6-b269-0054a67501d6', NULL);
INSERT INTO public.keycloak_role VALUES ('f22cac6b-f114-401d-9504-cfe1917dae1c', 'd6950149-318e-4aa6-b269-0054a67501d6', true, '${role_manage-identity-providers}', 'manage-identity-providers', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'd6950149-318e-4aa6-b269-0054a67501d6', NULL);
INSERT INTO public.keycloak_role VALUES ('d4801f2c-c1c0-4e24-bdba-e9a41dd21d93', 'd6950149-318e-4aa6-b269-0054a67501d6', true, '${role_manage-authorization}', 'manage-authorization', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'd6950149-318e-4aa6-b269-0054a67501d6', NULL);
INSERT INTO public.keycloak_role VALUES ('4aae8d25-631f-4113-ba73-dac0102881d2', 'd6950149-318e-4aa6-b269-0054a67501d6', true, '${role_query-users}', 'query-users', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'd6950149-318e-4aa6-b269-0054a67501d6', NULL);
INSERT INTO public.keycloak_role VALUES ('4cf8544f-937f-4f77-92c3-51bf5c9847f7', 'd6950149-318e-4aa6-b269-0054a67501d6', true, '${role_query-clients}', 'query-clients', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'd6950149-318e-4aa6-b269-0054a67501d6', NULL);
INSERT INTO public.keycloak_role VALUES ('f828f806-416b-4f7c-b254-cf4d93e2e7f5', 'd6950149-318e-4aa6-b269-0054a67501d6', true, '${role_query-realms}', 'query-realms', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'd6950149-318e-4aa6-b269-0054a67501d6', NULL);
INSERT INTO public.keycloak_role VALUES ('aeceae38-c935-4f5c-8dec-6455461c925c', 'd6950149-318e-4aa6-b269-0054a67501d6', true, '${role_query-groups}', 'query-groups', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'd6950149-318e-4aa6-b269-0054a67501d6', NULL);
INSERT INTO public.keycloak_role VALUES ('8bdb3d68-fe5a-4d3e-b81b-5a63cca0ad7a', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', true, '${role_realm-admin}', 'realm-admin', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', NULL);
INSERT INTO public.keycloak_role VALUES ('7212e416-3619-4e82-a2fc-d449342d80fc', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', true, '${role_create-client}', 'create-client', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', NULL);
INSERT INTO public.keycloak_role VALUES ('25b46a59-f021-43ea-885c-2e43d7daca46', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', true, '${role_view-realm}', 'view-realm', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', NULL);
INSERT INTO public.keycloak_role VALUES ('e48a3acd-c896-4624-988a-2b697bbdaf6d', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', true, '${role_view-users}', 'view-users', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', NULL);
INSERT INTO public.keycloak_role VALUES ('95afcb48-6cfe-4db6-98fb-751c3d0cfcea', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', true, '${role_view-clients}', 'view-clients', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', NULL);
INSERT INTO public.keycloak_role VALUES ('1679332a-b26f-49dc-b35e-ab358ac09320', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', true, '${role_view-events}', 'view-events', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', NULL);
INSERT INTO public.keycloak_role VALUES ('55ebdd66-30a9-4981-8ed1-e3260dacfb49', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', true, '${role_view-identity-providers}', 'view-identity-providers', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', NULL);
INSERT INTO public.keycloak_role VALUES ('4ebb0d5e-bcf4-4432-859f-a84422fada5d', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', true, '${role_view-authorization}', 'view-authorization', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', NULL);
INSERT INTO public.keycloak_role VALUES ('c5e4e6b1-7b07-4319-a558-1446a413ad29', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', true, '${role_manage-realm}', 'manage-realm', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', NULL);
INSERT INTO public.keycloak_role VALUES ('713a0132-1077-44c2-a7a8-547a9ed2aeea', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', true, '${role_manage-users}', 'manage-users', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', NULL);
INSERT INTO public.keycloak_role VALUES ('fa192e7f-b3b8-434c-80e4-c6e8fc3bf76c', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', true, '${role_manage-clients}', 'manage-clients', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', NULL);
INSERT INTO public.keycloak_role VALUES ('320ad00d-df4f-49b7-8c60-9ef7d526b76c', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', true, '${role_manage-events}', 'manage-events', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', NULL);
INSERT INTO public.keycloak_role VALUES ('4aed72c9-e297-4154-845b-74da79442fcb', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', true, '${role_manage-identity-providers}', 'manage-identity-providers', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', NULL);
INSERT INTO public.keycloak_role VALUES ('89b91be0-4af3-4bca-88c0-900efb01528b', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', true, '${role_manage-authorization}', 'manage-authorization', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', NULL);
INSERT INTO public.keycloak_role VALUES ('8abb284b-e04d-42e8-97ff-028021fc669f', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', true, '${role_query-users}', 'query-users', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', NULL);
INSERT INTO public.keycloak_role VALUES ('e285353b-de98-44a9-b14f-cfb2ed73d59e', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', true, '${role_query-clients}', 'query-clients', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', NULL);
INSERT INTO public.keycloak_role VALUES ('139e8d31-d815-44f9-b55b-4e70a39b1813', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', true, '${role_query-realms}', 'query-realms', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', NULL);
INSERT INTO public.keycloak_role VALUES ('f56c19f8-d803-405e-9f32-15f28dba1b1c', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', true, '${role_query-groups}', 'query-groups', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', NULL);
INSERT INTO public.keycloak_role VALUES ('39fb8cd7-7bd2-428b-a1e3-552fa1b7982f', '09f537ab-f042-4fdc-90e5-93431b52d758', true, '${role_view-profile}', 'view-profile', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '09f537ab-f042-4fdc-90e5-93431b52d758', NULL);
INSERT INTO public.keycloak_role VALUES ('5d9a4233-4be8-4091-bdf1-c1bfd736d4c9', '09f537ab-f042-4fdc-90e5-93431b52d758', true, '${role_manage-account}', 'manage-account', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '09f537ab-f042-4fdc-90e5-93431b52d758', NULL);
INSERT INTO public.keycloak_role VALUES ('07e4b0a1-8f96-4b79-a5ed-49afe41df3dc', '09f537ab-f042-4fdc-90e5-93431b52d758', true, '${role_manage-account-links}', 'manage-account-links', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '09f537ab-f042-4fdc-90e5-93431b52d758', NULL);
INSERT INTO public.keycloak_role VALUES ('ed6337a6-c983-42f5-ae2d-7763679ed969', '09f537ab-f042-4fdc-90e5-93431b52d758', true, '${role_view-applications}', 'view-applications', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '09f537ab-f042-4fdc-90e5-93431b52d758', NULL);
INSERT INTO public.keycloak_role VALUES ('066e990c-a27d-42f7-9b22-28581ae2fc3e', '09f537ab-f042-4fdc-90e5-93431b52d758', true, '${role_view-consent}', 'view-consent', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '09f537ab-f042-4fdc-90e5-93431b52d758', NULL);
INSERT INTO public.keycloak_role VALUES ('d190edde-d97c-4347-a73a-7ebaa3f71449', '09f537ab-f042-4fdc-90e5-93431b52d758', true, '${role_manage-consent}', 'manage-consent', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '09f537ab-f042-4fdc-90e5-93431b52d758', NULL);
INSERT INTO public.keycloak_role VALUES ('e1972537-b603-4513-8723-e87bedb2e453', '09f537ab-f042-4fdc-90e5-93431b52d758', true, '${role_view-groups}', 'view-groups', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '09f537ab-f042-4fdc-90e5-93431b52d758', NULL);
INSERT INTO public.keycloak_role VALUES ('2370e307-8bf6-47d9-a4d0-2fde0e8d0947', '09f537ab-f042-4fdc-90e5-93431b52d758', true, '${role_delete-account}', 'delete-account', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '09f537ab-f042-4fdc-90e5-93431b52d758', NULL);
INSERT INTO public.keycloak_role VALUES ('3e48e728-f874-4e1f-b04f-7e9dcd067f10', 'd6950149-318e-4aa6-b269-0054a67501d6', true, '${role_impersonation}', 'impersonation', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'd6950149-318e-4aa6-b269-0054a67501d6', NULL);
INSERT INTO public.keycloak_role VALUES ('5abccc3f-f706-4749-a154-538b77bae7fa', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', true, '${role_impersonation}', 'impersonation', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '7fd24a20-154a-4f3e-8b33-8f1f0a3f147c', NULL);
INSERT INTO public.keycloak_role VALUES ('6de68c76-5d6c-4550-8007-d52230f81a84', '00f02027-97d5-4940-9702-167480c7a369', true, '${role_read-token}', 'read-token', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '00f02027-97d5-4940-9702-167480c7a369', NULL);
INSERT INTO public.keycloak_role VALUES ('5c4bc45a-6893-4c05-8fdc-3c81acf61bd7', '000c9ecc-9c3a-44d3-94fe-941ff152490f', false, '${role_offline-access}', 'offline_access', '000c9ecc-9c3a-44d3-94fe-941ff152490f', NULL, NULL);
INSERT INTO public.keycloak_role VALUES ('8936874f-9c3a-42d8-9e1f-43c82c66a384', '000c9ecc-9c3a-44d3-94fe-941ff152490f', false, '${role_uma_authorization}', 'uma_authorization', '000c9ecc-9c3a-44d3-94fe-941ff152490f', NULL, NULL);
INSERT INTO public.keycloak_role VALUES ('50808e75-e563-4c76-9f0b-b6e8dcce4553', 'a17e62f0-27d3-4e2f-9362-451b9cc24dc3', true, '', 'admin', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'a17e62f0-27d3-4e2f-9362-451b9cc24dc3', NULL);
INSERT INTO public.keycloak_role VALUES ('e0d10597-bf56-4ce3-8d60-fcc45260c6b6', 'a17e62f0-27d3-4e2f-9362-451b9cc24dc3', true, '', 'teacher', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'a17e62f0-27d3-4e2f-9362-451b9cc24dc3', NULL);
INSERT INTO public.keycloak_role VALUES ('8a963c36-ca66-45f9-af62-ce439801f0d3', 'a17e62f0-27d3-4e2f-9362-451b9cc24dc3', true, '', 'student', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'a17e62f0-27d3-4e2f-9362-451b9cc24dc3', NULL);


--
-- TOC entry 4253 (class 0 OID 16598)
-- Dependencies: 256
-- Data for Name: migration_model; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.migration_model VALUES ('x5rd4', '26.4.0', 1760474919);


--
-- TOC entry 4254 (class 0 OID 16602)
-- Dependencies: 257
-- Data for Name: offline_client_session; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4255 (class 0 OID 16610)
-- Dependencies: 258
-- Data for Name: offline_user_session; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4256 (class 0 OID 16617)
-- Dependencies: 259
-- Data for Name: org; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4257 (class 0 OID 16622)
-- Dependencies: 260
-- Data for Name: org_domain; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4258 (class 0 OID 16627)
-- Dependencies: 261
-- Data for Name: policy_config; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4259 (class 0 OID 16632)
-- Dependencies: 262
-- Data for Name: protocol_mapper; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.protocol_mapper VALUES ('4c6ccb53-22c9-4cd7-948d-bd24c649b28c', 'audience resolve', 'openid-connect', 'oidc-audience-resolve-mapper', '5e3fa378-9c17-4fea-a010-658a9422c2c9', NULL);
INSERT INTO public.protocol_mapper VALUES ('e89b27fd-fe25-473a-afe0-ed902cc124f8', 'locale', 'openid-connect', 'oidc-usermodel-attribute-mapper', '46c97fed-5865-497a-90cc-eeb6a263032a', NULL);
INSERT INTO public.protocol_mapper VALUES ('2a679901-68ef-478f-8ea3-8f90e9a2fa22', 'role list', 'saml', 'saml-role-list-mapper', NULL, '58e46e1a-cc0e-4fd2-980a-4c77088f7e35');
INSERT INTO public.protocol_mapper VALUES ('bd6dabc0-087d-4f93-8a53-93156c2acd24', 'organization', 'saml', 'saml-organization-membership-mapper', NULL, 'fd9493c9-59f4-4a84-a97b-9b0b8ecd942f');
INSERT INTO public.protocol_mapper VALUES ('8e5556b8-cf5a-44a3-83de-5eb3b2fe6bf6', 'full name', 'openid-connect', 'oidc-full-name-mapper', NULL, '62575e76-6395-4763-8bef-09e8e8d59993');
INSERT INTO public.protocol_mapper VALUES ('0f353b9b-f379-4628-b30a-95cf602eeaf4', 'family name', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, '62575e76-6395-4763-8bef-09e8e8d59993');
INSERT INTO public.protocol_mapper VALUES ('2742f916-da37-4df9-8748-36b5c9cda0dd', 'given name', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, '62575e76-6395-4763-8bef-09e8e8d59993');
INSERT INTO public.protocol_mapper VALUES ('041b1221-d92b-4a9b-aaff-b6d229795825', 'middle name', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, '62575e76-6395-4763-8bef-09e8e8d59993');
INSERT INTO public.protocol_mapper VALUES ('4742e329-b77c-4b2d-bd87-91c5b9a5f60f', 'nickname', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, '62575e76-6395-4763-8bef-09e8e8d59993');
INSERT INTO public.protocol_mapper VALUES ('6c2d59d8-2fdc-45f8-b8a0-dddb7375ca06', 'username', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, '62575e76-6395-4763-8bef-09e8e8d59993');
INSERT INTO public.protocol_mapper VALUES ('37c45c06-631e-4c16-a76a-204eb8e73586', 'profile', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, '62575e76-6395-4763-8bef-09e8e8d59993');
INSERT INTO public.protocol_mapper VALUES ('5ebfbb1f-bec4-4059-b71e-ec63ad271ca6', 'picture', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, '62575e76-6395-4763-8bef-09e8e8d59993');
INSERT INTO public.protocol_mapper VALUES ('2bee3c60-f9a2-441d-b3df-1d98a5f0005c', 'website', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, '62575e76-6395-4763-8bef-09e8e8d59993');
INSERT INTO public.protocol_mapper VALUES ('275cbc4b-3bcf-45ff-98a9-1f7abfe74596', 'gender', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, '62575e76-6395-4763-8bef-09e8e8d59993');
INSERT INTO public.protocol_mapper VALUES ('27b89e25-2b40-4846-bc57-5109b8610d76', 'birthdate', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, '62575e76-6395-4763-8bef-09e8e8d59993');
INSERT INTO public.protocol_mapper VALUES ('0aeb2d24-81ca-4837-a116-27bdbabab431', 'zoneinfo', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, '62575e76-6395-4763-8bef-09e8e8d59993');
INSERT INTO public.protocol_mapper VALUES ('58c73812-fbb1-4cfd-9af1-145660ea2787', 'locale', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, '62575e76-6395-4763-8bef-09e8e8d59993');
INSERT INTO public.protocol_mapper VALUES ('faaf6755-ea64-4920-82f4-c23a2944fad4', 'updated at', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, '62575e76-6395-4763-8bef-09e8e8d59993');
INSERT INTO public.protocol_mapper VALUES ('d4a5a6e1-0331-40e3-895c-cbc049574510', 'email', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, '593c1616-ca62-42db-94eb-f3c5487a52da');
INSERT INTO public.protocol_mapper VALUES ('0ee2d034-6b3b-46ff-98fd-f06e0e878f40', 'email verified', 'openid-connect', 'oidc-usermodel-property-mapper', NULL, '593c1616-ca62-42db-94eb-f3c5487a52da');
INSERT INTO public.protocol_mapper VALUES ('e308230a-2fd2-4b0d-ba2b-f5871177dda1', 'address', 'openid-connect', 'oidc-address-mapper', NULL, '688617ce-f549-4120-a885-33b3dfae6282');
INSERT INTO public.protocol_mapper VALUES ('4e6a58e4-199d-4d88-8d58-229a5a7a60c1', 'phone number', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, '68d40b24-a216-4a20-84b6-81420d7a0c95');
INSERT INTO public.protocol_mapper VALUES ('96640657-acbf-47d6-8a30-6d63a1264102', 'phone number verified', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, '68d40b24-a216-4a20-84b6-81420d7a0c95');
INSERT INTO public.protocol_mapper VALUES ('e6160ee8-71a3-4a55-89e7-cc0a7fec46a7', 'realm roles', 'openid-connect', 'oidc-usermodel-realm-role-mapper', NULL, 'c5eed9dc-700f-4362-8804-04f04da04765');
INSERT INTO public.protocol_mapper VALUES ('dc988fc8-e35a-4cec-95d6-029c04981de9', 'client roles', 'openid-connect', 'oidc-usermodel-client-role-mapper', NULL, 'c5eed9dc-700f-4362-8804-04f04da04765');
INSERT INTO public.protocol_mapper VALUES ('b3e4b375-c3d4-4da3-8024-16d7ef171778', 'audience resolve', 'openid-connect', 'oidc-audience-resolve-mapper', NULL, 'c5eed9dc-700f-4362-8804-04f04da04765');
INSERT INTO public.protocol_mapper VALUES ('36ad57ec-64dc-4be9-988d-1c85211df96e', 'allowed web origins', 'openid-connect', 'oidc-allowed-origins-mapper', NULL, '62f74fe4-018f-4b9a-bbc3-cfdd9e1fb856');
INSERT INTO public.protocol_mapper VALUES ('befb8de3-3df8-4824-85d6-16295d642491', 'upn', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, '96bb40cf-535c-4937-ae0f-0c913bf5952f');
INSERT INTO public.protocol_mapper VALUES ('e16043b0-fdb9-4400-84f8-27ba182cb3bc', 'groups', 'openid-connect', 'oidc-usermodel-realm-role-mapper', NULL, '96bb40cf-535c-4937-ae0f-0c913bf5952f');
INSERT INTO public.protocol_mapper VALUES ('80aac542-d35f-47cb-9aaf-9e28427fea4c', 'acr loa level', 'openid-connect', 'oidc-acr-mapper', NULL, '01a2c8df-abd8-444c-8e7f-61d62c869545');
INSERT INTO public.protocol_mapper VALUES ('f2c7b5f9-6792-4a1f-92c3-7388403c812c', 'auth_time', 'openid-connect', 'oidc-usersessionmodel-note-mapper', NULL, '7e8f2efc-a69f-4c37-940d-aabff960c64b');
INSERT INTO public.protocol_mapper VALUES ('5f4d0a10-93e9-4f40-9351-d4b4fa266411', 'sub', 'openid-connect', 'oidc-sub-mapper', NULL, '7e8f2efc-a69f-4c37-940d-aabff960c64b');
INSERT INTO public.protocol_mapper VALUES ('2ff2e205-5698-4c54-a2fd-621f82248ca9', 'Client ID', 'openid-connect', 'oidc-usersessionmodel-note-mapper', NULL, 'f45a6387-28be-4af3-a9b1-19c4b45cb5fa');
INSERT INTO public.protocol_mapper VALUES ('fe5c6e12-8d95-4071-960c-221586684ebf', 'Client Host', 'openid-connect', 'oidc-usersessionmodel-note-mapper', NULL, 'f45a6387-28be-4af3-a9b1-19c4b45cb5fa');
INSERT INTO public.protocol_mapper VALUES ('a54e6ebe-401e-4225-91ad-dee9de1c1702', 'Client IP Address', 'openid-connect', 'oidc-usersessionmodel-note-mapper', NULL, 'f45a6387-28be-4af3-a9b1-19c4b45cb5fa');
INSERT INTO public.protocol_mapper VALUES ('2a9e3682-4eef-4c58-a20c-cc143c971511', 'organization', 'openid-connect', 'oidc-organization-membership-mapper', NULL, '354e93d1-efa3-497f-984f-8d4a0a76c2a6');
INSERT INTO public.protocol_mapper VALUES ('84b1768a-f45b-443d-be95-292ded2eccfe', 'audience resolve', 'openid-connect', 'oidc-audience-resolve-mapper', '0755204d-499f-4aa8-9844-73c138cd6e72', NULL);
INSERT INTO public.protocol_mapper VALUES ('078a6ae1-d784-4488-9fc6-b9b2a317c706', 'role list', 'saml', 'saml-role-list-mapper', NULL, '4dc9be4d-e7bc-48ec-8bd8-d2568f39b002');
INSERT INTO public.protocol_mapper VALUES ('2a34e150-4a0d-4b60-86fd-474eda06b62d', 'organization', 'saml', 'saml-organization-membership-mapper', NULL, 'ee632a6d-6ac6-47d5-8230-999b1a477a3a');
INSERT INTO public.protocol_mapper VALUES ('f7fff527-c791-4740-8cc8-44333100f8e0', 'full name', 'openid-connect', 'oidc-full-name-mapper', NULL, 'ac19754b-388f-4693-98be-d848d089fd01');
INSERT INTO public.protocol_mapper VALUES ('5ded516d-7e30-400e-89ba-4c471bad47f2', 'family name', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, 'ac19754b-388f-4693-98be-d848d089fd01');
INSERT INTO public.protocol_mapper VALUES ('139c7654-a7b4-4c05-8f95-e705c8ffdefb', 'given name', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, 'ac19754b-388f-4693-98be-d848d089fd01');
INSERT INTO public.protocol_mapper VALUES ('418a2212-44fc-4eeb-bf19-2a317213b118', 'middle name', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, 'ac19754b-388f-4693-98be-d848d089fd01');
INSERT INTO public.protocol_mapper VALUES ('c0f2fd18-3e32-48a3-97c4-83d28283af2b', 'nickname', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, 'ac19754b-388f-4693-98be-d848d089fd01');
INSERT INTO public.protocol_mapper VALUES ('48e04150-c03d-41ca-9016-7f9582179629', 'username', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, 'ac19754b-388f-4693-98be-d848d089fd01');
INSERT INTO public.protocol_mapper VALUES ('91360379-d194-45e4-bfd8-b07f4593035a', 'profile', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, 'ac19754b-388f-4693-98be-d848d089fd01');
INSERT INTO public.protocol_mapper VALUES ('c86f54a1-c1a1-42c4-bd7f-790b0054d91b', 'picture', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, 'ac19754b-388f-4693-98be-d848d089fd01');
INSERT INTO public.protocol_mapper VALUES ('5274728d-1699-444f-8bc2-3b0441bdf4a0', 'website', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, 'ac19754b-388f-4693-98be-d848d089fd01');
INSERT INTO public.protocol_mapper VALUES ('b0ace65d-5541-443b-8901-d80e05b3d41d', 'gender', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, 'ac19754b-388f-4693-98be-d848d089fd01');
INSERT INTO public.protocol_mapper VALUES ('92cb040a-3714-4a88-8228-1b31a1264bfd', 'birthdate', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, 'ac19754b-388f-4693-98be-d848d089fd01');
INSERT INTO public.protocol_mapper VALUES ('f656a9d6-7fa2-41f1-876e-7cd8881b54f8', 'zoneinfo', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, 'ac19754b-388f-4693-98be-d848d089fd01');
INSERT INTO public.protocol_mapper VALUES ('f9541655-a2a7-4176-9f27-625d5db8f3f4', 'locale', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, 'ac19754b-388f-4693-98be-d848d089fd01');
INSERT INTO public.protocol_mapper VALUES ('b538ca21-e9b3-4529-be1c-cb782ad5b76a', 'updated at', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, 'ac19754b-388f-4693-98be-d848d089fd01');
INSERT INTO public.protocol_mapper VALUES ('8a7f5870-a084-4c28-99f3-8bbd6c84af17', 'email', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, 'a1fff042-318c-4d6e-9aa1-c8c20bd59868');
INSERT INTO public.protocol_mapper VALUES ('416b0dab-5747-4efe-ae65-5f6a86098928', 'email verified', 'openid-connect', 'oidc-usermodel-property-mapper', NULL, 'a1fff042-318c-4d6e-9aa1-c8c20bd59868');
INSERT INTO public.protocol_mapper VALUES ('ddf427e2-d342-409c-85f9-b4e8857f7da3', 'address', 'openid-connect', 'oidc-address-mapper', NULL, '7b1c264b-9d0c-4b3b-b16e-69fc224d9f7f');
INSERT INTO public.protocol_mapper VALUES ('ea7b9ad3-2714-4897-937e-b25166034709', 'phone number', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, '18650c31-3ce4-4b1e-8f73-875ae273569d');
INSERT INTO public.protocol_mapper VALUES ('78f2d81d-920c-41d3-95d7-d15ced177620', 'phone number verified', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, '18650c31-3ce4-4b1e-8f73-875ae273569d');
INSERT INTO public.protocol_mapper VALUES ('79db3cd4-e980-444a-b962-6c4ef9d55d48', 'realm roles', 'openid-connect', 'oidc-usermodel-realm-role-mapper', NULL, 'a8acc800-a1e6-442a-b50f-b4a7d4b72fb5');
INSERT INTO public.protocol_mapper VALUES ('dab42db1-00fe-4c0a-a1b9-6124b17f5549', 'client roles', 'openid-connect', 'oidc-usermodel-client-role-mapper', NULL, 'a8acc800-a1e6-442a-b50f-b4a7d4b72fb5');
INSERT INTO public.protocol_mapper VALUES ('3997e1fc-5f30-49a7-bf20-c6311052dd75', 'audience resolve', 'openid-connect', 'oidc-audience-resolve-mapper', NULL, 'a8acc800-a1e6-442a-b50f-b4a7d4b72fb5');
INSERT INTO public.protocol_mapper VALUES ('a17a0dd4-39e1-4b44-8698-8eb5e92168ff', 'allowed web origins', 'openid-connect', 'oidc-allowed-origins-mapper', NULL, 'bf3b4f1d-f637-4455-ace8-25e492d59f36');
INSERT INTO public.protocol_mapper VALUES ('f6d2827f-fcf7-4e16-910b-2eeaaea0219a', 'upn', 'openid-connect', 'oidc-usermodel-attribute-mapper', NULL, '748440bd-2511-49b1-911a-d7358db20a62');
INSERT INTO public.protocol_mapper VALUES ('aaaaac46-7095-418c-8149-1ad65e9a4aba', 'groups', 'openid-connect', 'oidc-usermodel-realm-role-mapper', NULL, '748440bd-2511-49b1-911a-d7358db20a62');
INSERT INTO public.protocol_mapper VALUES ('bce459ac-ff1a-4e33-9ddb-b89d21fb26ac', 'acr loa level', 'openid-connect', 'oidc-acr-mapper', NULL, 'b7a462eb-095f-4d94-b789-fe46b3c02b37');
INSERT INTO public.protocol_mapper VALUES ('d1f12915-572f-425b-b0d7-db9f85f25831', 'auth_time', 'openid-connect', 'oidc-usersessionmodel-note-mapper', NULL, 'a63914be-3f59-4780-98f4-ed55a3bb4d1e');
INSERT INTO public.protocol_mapper VALUES ('066fb88a-8855-4e0b-a035-a0171fc9cc63', 'sub', 'openid-connect', 'oidc-sub-mapper', NULL, 'a63914be-3f59-4780-98f4-ed55a3bb4d1e');
INSERT INTO public.protocol_mapper VALUES ('8cee37c4-2b2b-4d4f-b718-98d8ca82d5b1', 'Client ID', 'openid-connect', 'oidc-usersessionmodel-note-mapper', NULL, '9328cd16-48bc-4c91-93ad-a9366688d6e8');
INSERT INTO public.protocol_mapper VALUES ('1a2dc5b8-17fb-4bdb-a531-e2aa16354874', 'Client Host', 'openid-connect', 'oidc-usersessionmodel-note-mapper', NULL, '9328cd16-48bc-4c91-93ad-a9366688d6e8');
INSERT INTO public.protocol_mapper VALUES ('5fc616ec-ae4b-435b-b7c7-a83258712bea', 'Client IP Address', 'openid-connect', 'oidc-usersessionmodel-note-mapper', NULL, '9328cd16-48bc-4c91-93ad-a9366688d6e8');
INSERT INTO public.protocol_mapper VALUES ('c27c3d28-696a-4350-bc0d-07e7f529dabe', 'organization', 'openid-connect', 'oidc-organization-membership-mapper', NULL, '0f21e46c-0abc-44e7-b9c5-2da49b32e298');
INSERT INTO public.protocol_mapper VALUES ('b4d3fb7c-03d4-42fd-a77e-d4c3c6faed03', 'locale', 'openid-connect', 'oidc-usermodel-attribute-mapper', 'f386953e-2fb0-4093-b0a6-bc07803ce34e', NULL);


--
-- TOC entry 4260 (class 0 OID 16637)
-- Dependencies: 263
-- Data for Name: protocol_mapper_config; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.protocol_mapper_config VALUES ('e89b27fd-fe25-473a-afe0-ed902cc124f8', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('e89b27fd-fe25-473a-afe0-ed902cc124f8', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('e89b27fd-fe25-473a-afe0-ed902cc124f8', 'locale', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('e89b27fd-fe25-473a-afe0-ed902cc124f8', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('e89b27fd-fe25-473a-afe0-ed902cc124f8', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('e89b27fd-fe25-473a-afe0-ed902cc124f8', 'locale', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('e89b27fd-fe25-473a-afe0-ed902cc124f8', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('2a679901-68ef-478f-8ea3-8f90e9a2fa22', 'false', 'single');
INSERT INTO public.protocol_mapper_config VALUES ('2a679901-68ef-478f-8ea3-8f90e9a2fa22', 'Basic', 'attribute.nameformat');
INSERT INTO public.protocol_mapper_config VALUES ('2a679901-68ef-478f-8ea3-8f90e9a2fa22', 'Role', 'attribute.name');
INSERT INTO public.protocol_mapper_config VALUES ('041b1221-d92b-4a9b-aaff-b6d229795825', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('041b1221-d92b-4a9b-aaff-b6d229795825', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('041b1221-d92b-4a9b-aaff-b6d229795825', 'middleName', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('041b1221-d92b-4a9b-aaff-b6d229795825', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('041b1221-d92b-4a9b-aaff-b6d229795825', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('041b1221-d92b-4a9b-aaff-b6d229795825', 'middle_name', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('041b1221-d92b-4a9b-aaff-b6d229795825', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('0aeb2d24-81ca-4837-a116-27bdbabab431', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('0aeb2d24-81ca-4837-a116-27bdbabab431', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('0aeb2d24-81ca-4837-a116-27bdbabab431', 'zoneinfo', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('0aeb2d24-81ca-4837-a116-27bdbabab431', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('0aeb2d24-81ca-4837-a116-27bdbabab431', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('0aeb2d24-81ca-4837-a116-27bdbabab431', 'zoneinfo', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('0aeb2d24-81ca-4837-a116-27bdbabab431', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('0f353b9b-f379-4628-b30a-95cf602eeaf4', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('0f353b9b-f379-4628-b30a-95cf602eeaf4', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('0f353b9b-f379-4628-b30a-95cf602eeaf4', 'lastName', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('0f353b9b-f379-4628-b30a-95cf602eeaf4', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('0f353b9b-f379-4628-b30a-95cf602eeaf4', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('0f353b9b-f379-4628-b30a-95cf602eeaf4', 'family_name', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('0f353b9b-f379-4628-b30a-95cf602eeaf4', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('2742f916-da37-4df9-8748-36b5c9cda0dd', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('2742f916-da37-4df9-8748-36b5c9cda0dd', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('2742f916-da37-4df9-8748-36b5c9cda0dd', 'firstName', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('2742f916-da37-4df9-8748-36b5c9cda0dd', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('2742f916-da37-4df9-8748-36b5c9cda0dd', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('2742f916-da37-4df9-8748-36b5c9cda0dd', 'given_name', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('2742f916-da37-4df9-8748-36b5c9cda0dd', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('275cbc4b-3bcf-45ff-98a9-1f7abfe74596', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('275cbc4b-3bcf-45ff-98a9-1f7abfe74596', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('275cbc4b-3bcf-45ff-98a9-1f7abfe74596', 'gender', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('275cbc4b-3bcf-45ff-98a9-1f7abfe74596', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('275cbc4b-3bcf-45ff-98a9-1f7abfe74596', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('275cbc4b-3bcf-45ff-98a9-1f7abfe74596', 'gender', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('275cbc4b-3bcf-45ff-98a9-1f7abfe74596', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('27b89e25-2b40-4846-bc57-5109b8610d76', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('27b89e25-2b40-4846-bc57-5109b8610d76', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('27b89e25-2b40-4846-bc57-5109b8610d76', 'birthdate', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('27b89e25-2b40-4846-bc57-5109b8610d76', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('27b89e25-2b40-4846-bc57-5109b8610d76', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('27b89e25-2b40-4846-bc57-5109b8610d76', 'birthdate', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('27b89e25-2b40-4846-bc57-5109b8610d76', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('2bee3c60-f9a2-441d-b3df-1d98a5f0005c', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('2bee3c60-f9a2-441d-b3df-1d98a5f0005c', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('2bee3c60-f9a2-441d-b3df-1d98a5f0005c', 'website', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('2bee3c60-f9a2-441d-b3df-1d98a5f0005c', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('2bee3c60-f9a2-441d-b3df-1d98a5f0005c', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('2bee3c60-f9a2-441d-b3df-1d98a5f0005c', 'website', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('2bee3c60-f9a2-441d-b3df-1d98a5f0005c', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('37c45c06-631e-4c16-a76a-204eb8e73586', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('37c45c06-631e-4c16-a76a-204eb8e73586', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('37c45c06-631e-4c16-a76a-204eb8e73586', 'profile', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('37c45c06-631e-4c16-a76a-204eb8e73586', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('37c45c06-631e-4c16-a76a-204eb8e73586', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('37c45c06-631e-4c16-a76a-204eb8e73586', 'profile', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('37c45c06-631e-4c16-a76a-204eb8e73586', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('4742e329-b77c-4b2d-bd87-91c5b9a5f60f', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('4742e329-b77c-4b2d-bd87-91c5b9a5f60f', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('4742e329-b77c-4b2d-bd87-91c5b9a5f60f', 'nickname', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('4742e329-b77c-4b2d-bd87-91c5b9a5f60f', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('4742e329-b77c-4b2d-bd87-91c5b9a5f60f', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('4742e329-b77c-4b2d-bd87-91c5b9a5f60f', 'nickname', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('4742e329-b77c-4b2d-bd87-91c5b9a5f60f', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('58c73812-fbb1-4cfd-9af1-145660ea2787', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('58c73812-fbb1-4cfd-9af1-145660ea2787', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('58c73812-fbb1-4cfd-9af1-145660ea2787', 'locale', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('58c73812-fbb1-4cfd-9af1-145660ea2787', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('58c73812-fbb1-4cfd-9af1-145660ea2787', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('58c73812-fbb1-4cfd-9af1-145660ea2787', 'locale', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('58c73812-fbb1-4cfd-9af1-145660ea2787', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('5ebfbb1f-bec4-4059-b71e-ec63ad271ca6', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('5ebfbb1f-bec4-4059-b71e-ec63ad271ca6', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('5ebfbb1f-bec4-4059-b71e-ec63ad271ca6', 'picture', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('5ebfbb1f-bec4-4059-b71e-ec63ad271ca6', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('5ebfbb1f-bec4-4059-b71e-ec63ad271ca6', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('5ebfbb1f-bec4-4059-b71e-ec63ad271ca6', 'picture', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('5ebfbb1f-bec4-4059-b71e-ec63ad271ca6', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('6c2d59d8-2fdc-45f8-b8a0-dddb7375ca06', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('6c2d59d8-2fdc-45f8-b8a0-dddb7375ca06', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('6c2d59d8-2fdc-45f8-b8a0-dddb7375ca06', 'username', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('6c2d59d8-2fdc-45f8-b8a0-dddb7375ca06', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('6c2d59d8-2fdc-45f8-b8a0-dddb7375ca06', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('6c2d59d8-2fdc-45f8-b8a0-dddb7375ca06', 'preferred_username', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('6c2d59d8-2fdc-45f8-b8a0-dddb7375ca06', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('8e5556b8-cf5a-44a3-83de-5eb3b2fe6bf6', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('8e5556b8-cf5a-44a3-83de-5eb3b2fe6bf6', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('8e5556b8-cf5a-44a3-83de-5eb3b2fe6bf6', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('8e5556b8-cf5a-44a3-83de-5eb3b2fe6bf6', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('faaf6755-ea64-4920-82f4-c23a2944fad4', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('faaf6755-ea64-4920-82f4-c23a2944fad4', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('faaf6755-ea64-4920-82f4-c23a2944fad4', 'updatedAt', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('faaf6755-ea64-4920-82f4-c23a2944fad4', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('faaf6755-ea64-4920-82f4-c23a2944fad4', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('faaf6755-ea64-4920-82f4-c23a2944fad4', 'updated_at', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('faaf6755-ea64-4920-82f4-c23a2944fad4', 'long', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('0ee2d034-6b3b-46ff-98fd-f06e0e878f40', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('0ee2d034-6b3b-46ff-98fd-f06e0e878f40', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('0ee2d034-6b3b-46ff-98fd-f06e0e878f40', 'emailVerified', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('0ee2d034-6b3b-46ff-98fd-f06e0e878f40', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('0ee2d034-6b3b-46ff-98fd-f06e0e878f40', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('0ee2d034-6b3b-46ff-98fd-f06e0e878f40', 'email_verified', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('0ee2d034-6b3b-46ff-98fd-f06e0e878f40', 'boolean', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('d4a5a6e1-0331-40e3-895c-cbc049574510', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('d4a5a6e1-0331-40e3-895c-cbc049574510', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('d4a5a6e1-0331-40e3-895c-cbc049574510', 'email', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('d4a5a6e1-0331-40e3-895c-cbc049574510', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('d4a5a6e1-0331-40e3-895c-cbc049574510', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('d4a5a6e1-0331-40e3-895c-cbc049574510', 'email', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('d4a5a6e1-0331-40e3-895c-cbc049574510', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('e308230a-2fd2-4b0d-ba2b-f5871177dda1', 'formatted', 'user.attribute.formatted');
INSERT INTO public.protocol_mapper_config VALUES ('e308230a-2fd2-4b0d-ba2b-f5871177dda1', 'country', 'user.attribute.country');
INSERT INTO public.protocol_mapper_config VALUES ('e308230a-2fd2-4b0d-ba2b-f5871177dda1', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('e308230a-2fd2-4b0d-ba2b-f5871177dda1', 'postal_code', 'user.attribute.postal_code');
INSERT INTO public.protocol_mapper_config VALUES ('e308230a-2fd2-4b0d-ba2b-f5871177dda1', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('e308230a-2fd2-4b0d-ba2b-f5871177dda1', 'street', 'user.attribute.street');
INSERT INTO public.protocol_mapper_config VALUES ('e308230a-2fd2-4b0d-ba2b-f5871177dda1', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('e308230a-2fd2-4b0d-ba2b-f5871177dda1', 'region', 'user.attribute.region');
INSERT INTO public.protocol_mapper_config VALUES ('e308230a-2fd2-4b0d-ba2b-f5871177dda1', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('e308230a-2fd2-4b0d-ba2b-f5871177dda1', 'locality', 'user.attribute.locality');
INSERT INTO public.protocol_mapper_config VALUES ('4e6a58e4-199d-4d88-8d58-229a5a7a60c1', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('4e6a58e4-199d-4d88-8d58-229a5a7a60c1', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('4e6a58e4-199d-4d88-8d58-229a5a7a60c1', 'phoneNumber', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('4e6a58e4-199d-4d88-8d58-229a5a7a60c1', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('4e6a58e4-199d-4d88-8d58-229a5a7a60c1', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('4e6a58e4-199d-4d88-8d58-229a5a7a60c1', 'phone_number', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('4e6a58e4-199d-4d88-8d58-229a5a7a60c1', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('96640657-acbf-47d6-8a30-6d63a1264102', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('96640657-acbf-47d6-8a30-6d63a1264102', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('96640657-acbf-47d6-8a30-6d63a1264102', 'phoneNumberVerified', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('96640657-acbf-47d6-8a30-6d63a1264102', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('96640657-acbf-47d6-8a30-6d63a1264102', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('96640657-acbf-47d6-8a30-6d63a1264102', 'phone_number_verified', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('96640657-acbf-47d6-8a30-6d63a1264102', 'boolean', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('b3e4b375-c3d4-4da3-8024-16d7ef171778', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('b3e4b375-c3d4-4da3-8024-16d7ef171778', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('dc988fc8-e35a-4cec-95d6-029c04981de9', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('dc988fc8-e35a-4cec-95d6-029c04981de9', 'true', 'multivalued');
INSERT INTO public.protocol_mapper_config VALUES ('dc988fc8-e35a-4cec-95d6-029c04981de9', 'foo', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('dc988fc8-e35a-4cec-95d6-029c04981de9', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('dc988fc8-e35a-4cec-95d6-029c04981de9', 'resource_access.${client_id}.roles', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('dc988fc8-e35a-4cec-95d6-029c04981de9', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('e6160ee8-71a3-4a55-89e7-cc0a7fec46a7', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('e6160ee8-71a3-4a55-89e7-cc0a7fec46a7', 'true', 'multivalued');
INSERT INTO public.protocol_mapper_config VALUES ('e6160ee8-71a3-4a55-89e7-cc0a7fec46a7', 'foo', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('e6160ee8-71a3-4a55-89e7-cc0a7fec46a7', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('e6160ee8-71a3-4a55-89e7-cc0a7fec46a7', 'realm_access.roles', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('e6160ee8-71a3-4a55-89e7-cc0a7fec46a7', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('36ad57ec-64dc-4be9-988d-1c85211df96e', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('36ad57ec-64dc-4be9-988d-1c85211df96e', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('befb8de3-3df8-4824-85d6-16295d642491', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('befb8de3-3df8-4824-85d6-16295d642491', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('befb8de3-3df8-4824-85d6-16295d642491', 'username', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('befb8de3-3df8-4824-85d6-16295d642491', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('befb8de3-3df8-4824-85d6-16295d642491', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('befb8de3-3df8-4824-85d6-16295d642491', 'upn', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('befb8de3-3df8-4824-85d6-16295d642491', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('e16043b0-fdb9-4400-84f8-27ba182cb3bc', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('e16043b0-fdb9-4400-84f8-27ba182cb3bc', 'true', 'multivalued');
INSERT INTO public.protocol_mapper_config VALUES ('e16043b0-fdb9-4400-84f8-27ba182cb3bc', 'foo', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('e16043b0-fdb9-4400-84f8-27ba182cb3bc', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('e16043b0-fdb9-4400-84f8-27ba182cb3bc', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('e16043b0-fdb9-4400-84f8-27ba182cb3bc', 'groups', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('e16043b0-fdb9-4400-84f8-27ba182cb3bc', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('80aac542-d35f-47cb-9aaf-9e28427fea4c', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('80aac542-d35f-47cb-9aaf-9e28427fea4c', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('80aac542-d35f-47cb-9aaf-9e28427fea4c', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('5f4d0a10-93e9-4f40-9351-d4b4fa266411', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('5f4d0a10-93e9-4f40-9351-d4b4fa266411', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('f2c7b5f9-6792-4a1f-92c3-7388403c812c', 'AUTH_TIME', 'user.session.note');
INSERT INTO public.protocol_mapper_config VALUES ('f2c7b5f9-6792-4a1f-92c3-7388403c812c', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('f2c7b5f9-6792-4a1f-92c3-7388403c812c', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('f2c7b5f9-6792-4a1f-92c3-7388403c812c', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('f2c7b5f9-6792-4a1f-92c3-7388403c812c', 'auth_time', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('f2c7b5f9-6792-4a1f-92c3-7388403c812c', 'long', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('2ff2e205-5698-4c54-a2fd-621f82248ca9', 'client_id', 'user.session.note');
INSERT INTO public.protocol_mapper_config VALUES ('2ff2e205-5698-4c54-a2fd-621f82248ca9', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('2ff2e205-5698-4c54-a2fd-621f82248ca9', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('2ff2e205-5698-4c54-a2fd-621f82248ca9', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('2ff2e205-5698-4c54-a2fd-621f82248ca9', 'client_id', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('2ff2e205-5698-4c54-a2fd-621f82248ca9', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('a54e6ebe-401e-4225-91ad-dee9de1c1702', 'clientAddress', 'user.session.note');
INSERT INTO public.protocol_mapper_config VALUES ('a54e6ebe-401e-4225-91ad-dee9de1c1702', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('a54e6ebe-401e-4225-91ad-dee9de1c1702', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('a54e6ebe-401e-4225-91ad-dee9de1c1702', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('a54e6ebe-401e-4225-91ad-dee9de1c1702', 'clientAddress', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('a54e6ebe-401e-4225-91ad-dee9de1c1702', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('fe5c6e12-8d95-4071-960c-221586684ebf', 'clientHost', 'user.session.note');
INSERT INTO public.protocol_mapper_config VALUES ('fe5c6e12-8d95-4071-960c-221586684ebf', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('fe5c6e12-8d95-4071-960c-221586684ebf', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('fe5c6e12-8d95-4071-960c-221586684ebf', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('fe5c6e12-8d95-4071-960c-221586684ebf', 'clientHost', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('fe5c6e12-8d95-4071-960c-221586684ebf', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('2a9e3682-4eef-4c58-a20c-cc143c971511', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('2a9e3682-4eef-4c58-a20c-cc143c971511', 'true', 'multivalued');
INSERT INTO public.protocol_mapper_config VALUES ('2a9e3682-4eef-4c58-a20c-cc143c971511', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('2a9e3682-4eef-4c58-a20c-cc143c971511', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('2a9e3682-4eef-4c58-a20c-cc143c971511', 'organization', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('2a9e3682-4eef-4c58-a20c-cc143c971511', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('078a6ae1-d784-4488-9fc6-b9b2a317c706', 'false', 'single');
INSERT INTO public.protocol_mapper_config VALUES ('078a6ae1-d784-4488-9fc6-b9b2a317c706', 'Basic', 'attribute.nameformat');
INSERT INTO public.protocol_mapper_config VALUES ('078a6ae1-d784-4488-9fc6-b9b2a317c706', 'Role', 'attribute.name');
INSERT INTO public.protocol_mapper_config VALUES ('139c7654-a7b4-4c05-8f95-e705c8ffdefb', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('139c7654-a7b4-4c05-8f95-e705c8ffdefb', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('139c7654-a7b4-4c05-8f95-e705c8ffdefb', 'firstName', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('139c7654-a7b4-4c05-8f95-e705c8ffdefb', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('139c7654-a7b4-4c05-8f95-e705c8ffdefb', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('139c7654-a7b4-4c05-8f95-e705c8ffdefb', 'given_name', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('139c7654-a7b4-4c05-8f95-e705c8ffdefb', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('418a2212-44fc-4eeb-bf19-2a317213b118', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('418a2212-44fc-4eeb-bf19-2a317213b118', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('418a2212-44fc-4eeb-bf19-2a317213b118', 'middleName', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('418a2212-44fc-4eeb-bf19-2a317213b118', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('418a2212-44fc-4eeb-bf19-2a317213b118', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('418a2212-44fc-4eeb-bf19-2a317213b118', 'middle_name', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('418a2212-44fc-4eeb-bf19-2a317213b118', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('48e04150-c03d-41ca-9016-7f9582179629', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('48e04150-c03d-41ca-9016-7f9582179629', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('48e04150-c03d-41ca-9016-7f9582179629', 'username', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('48e04150-c03d-41ca-9016-7f9582179629', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('48e04150-c03d-41ca-9016-7f9582179629', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('48e04150-c03d-41ca-9016-7f9582179629', 'preferred_username', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('48e04150-c03d-41ca-9016-7f9582179629', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('5274728d-1699-444f-8bc2-3b0441bdf4a0', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('5274728d-1699-444f-8bc2-3b0441bdf4a0', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('5274728d-1699-444f-8bc2-3b0441bdf4a0', 'website', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('5274728d-1699-444f-8bc2-3b0441bdf4a0', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('5274728d-1699-444f-8bc2-3b0441bdf4a0', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('5274728d-1699-444f-8bc2-3b0441bdf4a0', 'website', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('5274728d-1699-444f-8bc2-3b0441bdf4a0', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('5ded516d-7e30-400e-89ba-4c471bad47f2', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('5ded516d-7e30-400e-89ba-4c471bad47f2', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('5ded516d-7e30-400e-89ba-4c471bad47f2', 'lastName', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('5ded516d-7e30-400e-89ba-4c471bad47f2', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('5ded516d-7e30-400e-89ba-4c471bad47f2', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('5ded516d-7e30-400e-89ba-4c471bad47f2', 'family_name', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('5ded516d-7e30-400e-89ba-4c471bad47f2', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('91360379-d194-45e4-bfd8-b07f4593035a', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('91360379-d194-45e4-bfd8-b07f4593035a', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('91360379-d194-45e4-bfd8-b07f4593035a', 'profile', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('91360379-d194-45e4-bfd8-b07f4593035a', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('91360379-d194-45e4-bfd8-b07f4593035a', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('91360379-d194-45e4-bfd8-b07f4593035a', 'profile', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('91360379-d194-45e4-bfd8-b07f4593035a', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('92cb040a-3714-4a88-8228-1b31a1264bfd', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('92cb040a-3714-4a88-8228-1b31a1264bfd', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('92cb040a-3714-4a88-8228-1b31a1264bfd', 'birthdate', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('92cb040a-3714-4a88-8228-1b31a1264bfd', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('92cb040a-3714-4a88-8228-1b31a1264bfd', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('92cb040a-3714-4a88-8228-1b31a1264bfd', 'birthdate', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('92cb040a-3714-4a88-8228-1b31a1264bfd', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('b0ace65d-5541-443b-8901-d80e05b3d41d', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('b0ace65d-5541-443b-8901-d80e05b3d41d', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('b0ace65d-5541-443b-8901-d80e05b3d41d', 'gender', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('b0ace65d-5541-443b-8901-d80e05b3d41d', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('b0ace65d-5541-443b-8901-d80e05b3d41d', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('b0ace65d-5541-443b-8901-d80e05b3d41d', 'gender', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('b0ace65d-5541-443b-8901-d80e05b3d41d', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('b538ca21-e9b3-4529-be1c-cb782ad5b76a', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('b538ca21-e9b3-4529-be1c-cb782ad5b76a', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('b538ca21-e9b3-4529-be1c-cb782ad5b76a', 'updatedAt', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('b538ca21-e9b3-4529-be1c-cb782ad5b76a', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('b538ca21-e9b3-4529-be1c-cb782ad5b76a', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('b538ca21-e9b3-4529-be1c-cb782ad5b76a', 'updated_at', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('b538ca21-e9b3-4529-be1c-cb782ad5b76a', 'long', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('c0f2fd18-3e32-48a3-97c4-83d28283af2b', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('c0f2fd18-3e32-48a3-97c4-83d28283af2b', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('c0f2fd18-3e32-48a3-97c4-83d28283af2b', 'nickname', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('c0f2fd18-3e32-48a3-97c4-83d28283af2b', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('c0f2fd18-3e32-48a3-97c4-83d28283af2b', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('c0f2fd18-3e32-48a3-97c4-83d28283af2b', 'nickname', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('c0f2fd18-3e32-48a3-97c4-83d28283af2b', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('c86f54a1-c1a1-42c4-bd7f-790b0054d91b', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('c86f54a1-c1a1-42c4-bd7f-790b0054d91b', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('c86f54a1-c1a1-42c4-bd7f-790b0054d91b', 'picture', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('c86f54a1-c1a1-42c4-bd7f-790b0054d91b', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('c86f54a1-c1a1-42c4-bd7f-790b0054d91b', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('c86f54a1-c1a1-42c4-bd7f-790b0054d91b', 'picture', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('c86f54a1-c1a1-42c4-bd7f-790b0054d91b', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('f656a9d6-7fa2-41f1-876e-7cd8881b54f8', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('f656a9d6-7fa2-41f1-876e-7cd8881b54f8', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('f656a9d6-7fa2-41f1-876e-7cd8881b54f8', 'zoneinfo', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('f656a9d6-7fa2-41f1-876e-7cd8881b54f8', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('f656a9d6-7fa2-41f1-876e-7cd8881b54f8', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('f656a9d6-7fa2-41f1-876e-7cd8881b54f8', 'zoneinfo', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('f656a9d6-7fa2-41f1-876e-7cd8881b54f8', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('f7fff527-c791-4740-8cc8-44333100f8e0', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('f7fff527-c791-4740-8cc8-44333100f8e0', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('f7fff527-c791-4740-8cc8-44333100f8e0', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('f7fff527-c791-4740-8cc8-44333100f8e0', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('f9541655-a2a7-4176-9f27-625d5db8f3f4', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('f9541655-a2a7-4176-9f27-625d5db8f3f4', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('f9541655-a2a7-4176-9f27-625d5db8f3f4', 'locale', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('f9541655-a2a7-4176-9f27-625d5db8f3f4', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('f9541655-a2a7-4176-9f27-625d5db8f3f4', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('f9541655-a2a7-4176-9f27-625d5db8f3f4', 'locale', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('f9541655-a2a7-4176-9f27-625d5db8f3f4', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('416b0dab-5747-4efe-ae65-5f6a86098928', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('416b0dab-5747-4efe-ae65-5f6a86098928', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('416b0dab-5747-4efe-ae65-5f6a86098928', 'emailVerified', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('416b0dab-5747-4efe-ae65-5f6a86098928', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('416b0dab-5747-4efe-ae65-5f6a86098928', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('416b0dab-5747-4efe-ae65-5f6a86098928', 'email_verified', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('416b0dab-5747-4efe-ae65-5f6a86098928', 'boolean', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('8a7f5870-a084-4c28-99f3-8bbd6c84af17', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('8a7f5870-a084-4c28-99f3-8bbd6c84af17', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('8a7f5870-a084-4c28-99f3-8bbd6c84af17', 'email', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('8a7f5870-a084-4c28-99f3-8bbd6c84af17', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('8a7f5870-a084-4c28-99f3-8bbd6c84af17', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('8a7f5870-a084-4c28-99f3-8bbd6c84af17', 'email', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('8a7f5870-a084-4c28-99f3-8bbd6c84af17', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('ddf427e2-d342-409c-85f9-b4e8857f7da3', 'formatted', 'user.attribute.formatted');
INSERT INTO public.protocol_mapper_config VALUES ('ddf427e2-d342-409c-85f9-b4e8857f7da3', 'country', 'user.attribute.country');
INSERT INTO public.protocol_mapper_config VALUES ('ddf427e2-d342-409c-85f9-b4e8857f7da3', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('ddf427e2-d342-409c-85f9-b4e8857f7da3', 'postal_code', 'user.attribute.postal_code');
INSERT INTO public.protocol_mapper_config VALUES ('ddf427e2-d342-409c-85f9-b4e8857f7da3', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('ddf427e2-d342-409c-85f9-b4e8857f7da3', 'street', 'user.attribute.street');
INSERT INTO public.protocol_mapper_config VALUES ('ddf427e2-d342-409c-85f9-b4e8857f7da3', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('ddf427e2-d342-409c-85f9-b4e8857f7da3', 'region', 'user.attribute.region');
INSERT INTO public.protocol_mapper_config VALUES ('ddf427e2-d342-409c-85f9-b4e8857f7da3', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('ddf427e2-d342-409c-85f9-b4e8857f7da3', 'locality', 'user.attribute.locality');
INSERT INTO public.protocol_mapper_config VALUES ('78f2d81d-920c-41d3-95d7-d15ced177620', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('78f2d81d-920c-41d3-95d7-d15ced177620', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('78f2d81d-920c-41d3-95d7-d15ced177620', 'phoneNumberVerified', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('78f2d81d-920c-41d3-95d7-d15ced177620', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('78f2d81d-920c-41d3-95d7-d15ced177620', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('78f2d81d-920c-41d3-95d7-d15ced177620', 'phone_number_verified', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('78f2d81d-920c-41d3-95d7-d15ced177620', 'boolean', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('ea7b9ad3-2714-4897-937e-b25166034709', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('ea7b9ad3-2714-4897-937e-b25166034709', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('ea7b9ad3-2714-4897-937e-b25166034709', 'phoneNumber', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('ea7b9ad3-2714-4897-937e-b25166034709', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('ea7b9ad3-2714-4897-937e-b25166034709', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('ea7b9ad3-2714-4897-937e-b25166034709', 'phone_number', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('ea7b9ad3-2714-4897-937e-b25166034709', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('3997e1fc-5f30-49a7-bf20-c6311052dd75', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('3997e1fc-5f30-49a7-bf20-c6311052dd75', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('79db3cd4-e980-444a-b962-6c4ef9d55d48', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('79db3cd4-e980-444a-b962-6c4ef9d55d48', 'true', 'multivalued');
INSERT INTO public.protocol_mapper_config VALUES ('79db3cd4-e980-444a-b962-6c4ef9d55d48', 'foo', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('79db3cd4-e980-444a-b962-6c4ef9d55d48', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('79db3cd4-e980-444a-b962-6c4ef9d55d48', 'realm_access.roles', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('79db3cd4-e980-444a-b962-6c4ef9d55d48', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('dab42db1-00fe-4c0a-a1b9-6124b17f5549', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('dab42db1-00fe-4c0a-a1b9-6124b17f5549', 'true', 'multivalued');
INSERT INTO public.protocol_mapper_config VALUES ('dab42db1-00fe-4c0a-a1b9-6124b17f5549', 'foo', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('dab42db1-00fe-4c0a-a1b9-6124b17f5549', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('dab42db1-00fe-4c0a-a1b9-6124b17f5549', 'resource_access.${client_id}.roles', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('dab42db1-00fe-4c0a-a1b9-6124b17f5549', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('a17a0dd4-39e1-4b44-8698-8eb5e92168ff', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('a17a0dd4-39e1-4b44-8698-8eb5e92168ff', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('aaaaac46-7095-418c-8149-1ad65e9a4aba', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('aaaaac46-7095-418c-8149-1ad65e9a4aba', 'true', 'multivalued');
INSERT INTO public.protocol_mapper_config VALUES ('aaaaac46-7095-418c-8149-1ad65e9a4aba', 'foo', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('aaaaac46-7095-418c-8149-1ad65e9a4aba', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('aaaaac46-7095-418c-8149-1ad65e9a4aba', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('aaaaac46-7095-418c-8149-1ad65e9a4aba', 'groups', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('aaaaac46-7095-418c-8149-1ad65e9a4aba', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('f6d2827f-fcf7-4e16-910b-2eeaaea0219a', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('f6d2827f-fcf7-4e16-910b-2eeaaea0219a', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('f6d2827f-fcf7-4e16-910b-2eeaaea0219a', 'username', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('f6d2827f-fcf7-4e16-910b-2eeaaea0219a', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('f6d2827f-fcf7-4e16-910b-2eeaaea0219a', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('f6d2827f-fcf7-4e16-910b-2eeaaea0219a', 'upn', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('f6d2827f-fcf7-4e16-910b-2eeaaea0219a', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('bce459ac-ff1a-4e33-9ddb-b89d21fb26ac', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('bce459ac-ff1a-4e33-9ddb-b89d21fb26ac', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('bce459ac-ff1a-4e33-9ddb-b89d21fb26ac', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('066fb88a-8855-4e0b-a035-a0171fc9cc63', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('066fb88a-8855-4e0b-a035-a0171fc9cc63', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('d1f12915-572f-425b-b0d7-db9f85f25831', 'AUTH_TIME', 'user.session.note');
INSERT INTO public.protocol_mapper_config VALUES ('d1f12915-572f-425b-b0d7-db9f85f25831', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('d1f12915-572f-425b-b0d7-db9f85f25831', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('d1f12915-572f-425b-b0d7-db9f85f25831', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('d1f12915-572f-425b-b0d7-db9f85f25831', 'auth_time', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('d1f12915-572f-425b-b0d7-db9f85f25831', 'long', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('1a2dc5b8-17fb-4bdb-a531-e2aa16354874', 'clientHost', 'user.session.note');
INSERT INTO public.protocol_mapper_config VALUES ('1a2dc5b8-17fb-4bdb-a531-e2aa16354874', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('1a2dc5b8-17fb-4bdb-a531-e2aa16354874', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('1a2dc5b8-17fb-4bdb-a531-e2aa16354874', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('1a2dc5b8-17fb-4bdb-a531-e2aa16354874', 'clientHost', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('1a2dc5b8-17fb-4bdb-a531-e2aa16354874', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('5fc616ec-ae4b-435b-b7c7-a83258712bea', 'clientAddress', 'user.session.note');
INSERT INTO public.protocol_mapper_config VALUES ('5fc616ec-ae4b-435b-b7c7-a83258712bea', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('5fc616ec-ae4b-435b-b7c7-a83258712bea', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('5fc616ec-ae4b-435b-b7c7-a83258712bea', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('5fc616ec-ae4b-435b-b7c7-a83258712bea', 'clientAddress', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('5fc616ec-ae4b-435b-b7c7-a83258712bea', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('8cee37c4-2b2b-4d4f-b718-98d8ca82d5b1', 'client_id', 'user.session.note');
INSERT INTO public.protocol_mapper_config VALUES ('8cee37c4-2b2b-4d4f-b718-98d8ca82d5b1', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('8cee37c4-2b2b-4d4f-b718-98d8ca82d5b1', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('8cee37c4-2b2b-4d4f-b718-98d8ca82d5b1', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('8cee37c4-2b2b-4d4f-b718-98d8ca82d5b1', 'client_id', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('8cee37c4-2b2b-4d4f-b718-98d8ca82d5b1', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('c27c3d28-696a-4350-bc0d-07e7f529dabe', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('c27c3d28-696a-4350-bc0d-07e7f529dabe', 'true', 'multivalued');
INSERT INTO public.protocol_mapper_config VALUES ('c27c3d28-696a-4350-bc0d-07e7f529dabe', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('c27c3d28-696a-4350-bc0d-07e7f529dabe', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('c27c3d28-696a-4350-bc0d-07e7f529dabe', 'organization', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('c27c3d28-696a-4350-bc0d-07e7f529dabe', 'String', 'jsonType.label');
INSERT INTO public.protocol_mapper_config VALUES ('b4d3fb7c-03d4-42fd-a77e-d4c3c6faed03', 'true', 'introspection.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('b4d3fb7c-03d4-42fd-a77e-d4c3c6faed03', 'true', 'userinfo.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('b4d3fb7c-03d4-42fd-a77e-d4c3c6faed03', 'locale', 'user.attribute');
INSERT INTO public.protocol_mapper_config VALUES ('b4d3fb7c-03d4-42fd-a77e-d4c3c6faed03', 'true', 'id.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('b4d3fb7c-03d4-42fd-a77e-d4c3c6faed03', 'true', 'access.token.claim');
INSERT INTO public.protocol_mapper_config VALUES ('b4d3fb7c-03d4-42fd-a77e-d4c3c6faed03', 'locale', 'claim.name');
INSERT INTO public.protocol_mapper_config VALUES ('b4d3fb7c-03d4-42fd-a77e-d4c3c6faed03', 'String', 'jsonType.label');


--
-- TOC entry 4261 (class 0 OID 16642)
-- Dependencies: 264
-- Data for Name: realm; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.realm VALUES ('000c9ecc-9c3a-44d3-94fe-941ff152490f', 60, 300, 300, NULL, NULL, NULL, true, false, 0, NULL, 'alumnet-realm', 0, NULL, false, false, true, false, 'EXTERNAL', 1800, 36000, false, false, 'd6950149-318e-4aa6-b269-0054a67501d6', 1800, false, NULL, true, false, false, false, 0, 1, 30, 6, 'HmacSHA1', 'totp', '32394dcf-6da2-4e7d-b6fa-6acef44b4833', '35f3caa7-69c6-4398-b74f-aa741f19159e', '94bc9f25-d56c-46c9-8913-1a1dcbbbac40', 'd594204e-3632-4604-8eb4-bcd7f91c30cc', '14f6eb27-14f0-4c17-929f-8cb4056ee86b', 2592000, false, 900, true, false, '0d4cabac-b754-4c13-86dd-eeca0bbbb374', 0, false, 0, 0, '0fc1515d-32eb-4643-b9e9-646337839092');
INSERT INTO public.realm VALUES ('0666ea4e-c88f-4e30-bf74-4874c0b2484d', 60, 300, 60, NULL, NULL, NULL, true, false, 0, NULL, 'master', 0, NULL, false, false, false, false, 'EXTERNAL', 1800, 36000, false, false, 'fc8ba69a-482f-4900-90ad-721fe89f195f', 1800, false, NULL, false, false, false, false, 0, 1, 30, 6, 'HmacSHA1', 'totp', 'affbec2d-069d-4f2a-9b65-af333fbf5548', '61fb27e0-6c9f-4b85-a10d-8b1edb66ea4d', '6102b505-eabb-4779-828c-2cb57638e709', '2a34c928-55ff-439e-8b01-a5f86a8f07ce', '2b0867c1-b64a-4ee6-b6b6-af336d9e78bf', 2592000, false, 900, true, false, '822d5bc8-000d-46a4-912e-8b520f0d7d0a', 0, false, 0, 0, '83d02c9a-4d21-4e86-b3a5-c4772f85ec6a');


--
-- TOC entry 4262 (class 0 OID 16675)
-- Dependencies: 265
-- Data for Name: realm_attribute; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.realm_attribute VALUES ('_browser_header.contentSecurityPolicyReportOnly', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '');
INSERT INTO public.realm_attribute VALUES ('_browser_header.xContentTypeOptions', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'nosniff');
INSERT INTO public.realm_attribute VALUES ('_browser_header.referrerPolicy', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'no-referrer');
INSERT INTO public.realm_attribute VALUES ('_browser_header.xRobotsTag', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'none');
INSERT INTO public.realm_attribute VALUES ('_browser_header.xFrameOptions', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'SAMEORIGIN');
INSERT INTO public.realm_attribute VALUES ('_browser_header.contentSecurityPolicy', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'frame-src ''self''; frame-ancestors ''self''; object-src ''none'';');
INSERT INTO public.realm_attribute VALUES ('_browser_header.strictTransportSecurity', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'max-age=31536000; includeSubDomains');
INSERT INTO public.realm_attribute VALUES ('bruteForceProtected', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'false');
INSERT INTO public.realm_attribute VALUES ('permanentLockout', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'false');
INSERT INTO public.realm_attribute VALUES ('maxTemporaryLockouts', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '0');
INSERT INTO public.realm_attribute VALUES ('bruteForceStrategy', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'MULTIPLE');
INSERT INTO public.realm_attribute VALUES ('maxFailureWaitSeconds', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '900');
INSERT INTO public.realm_attribute VALUES ('minimumQuickLoginWaitSeconds', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '60');
INSERT INTO public.realm_attribute VALUES ('waitIncrementSeconds', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '60');
INSERT INTO public.realm_attribute VALUES ('quickLoginCheckMilliSeconds', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '1000');
INSERT INTO public.realm_attribute VALUES ('maxDeltaTimeSeconds', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '43200');
INSERT INTO public.realm_attribute VALUES ('failureFactor', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '30');
INSERT INTO public.realm_attribute VALUES ('realmReusableOtpCode', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'false');
INSERT INTO public.realm_attribute VALUES ('firstBrokerLoginFlowId', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'd210a888-0779-446a-9d05-f23737ed5cbb');
INSERT INTO public.realm_attribute VALUES ('displayName', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'Keycloak');
INSERT INTO public.realm_attribute VALUES ('displayNameHtml', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '<div class="kc-logo-text"><span>Keycloak</span></div>');
INSERT INTO public.realm_attribute VALUES ('defaultSignatureAlgorithm', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'RS256');
INSERT INTO public.realm_attribute VALUES ('offlineSessionMaxLifespanEnabled', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'false');
INSERT INTO public.realm_attribute VALUES ('offlineSessionMaxLifespan', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', '5184000');
INSERT INTO public.realm_attribute VALUES ('_browser_header.contentSecurityPolicyReportOnly', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '');
INSERT INTO public.realm_attribute VALUES ('_browser_header.xContentTypeOptions', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'nosniff');
INSERT INTO public.realm_attribute VALUES ('_browser_header.referrerPolicy', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'no-referrer');
INSERT INTO public.realm_attribute VALUES ('_browser_header.xRobotsTag', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'none');
INSERT INTO public.realm_attribute VALUES ('_browser_header.xFrameOptions', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'SAMEORIGIN');
INSERT INTO public.realm_attribute VALUES ('_browser_header.contentSecurityPolicy', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'frame-src ''self''; frame-ancestors ''self''; object-src ''none'';');
INSERT INTO public.realm_attribute VALUES ('_browser_header.strictTransportSecurity', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'max-age=31536000; includeSubDomains');
INSERT INTO public.realm_attribute VALUES ('bruteForceProtected', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'false');
INSERT INTO public.realm_attribute VALUES ('permanentLockout', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'false');
INSERT INTO public.realm_attribute VALUES ('maxTemporaryLockouts', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '0');
INSERT INTO public.realm_attribute VALUES ('bruteForceStrategy', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'MULTIPLE');
INSERT INTO public.realm_attribute VALUES ('maxFailureWaitSeconds', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '900');
INSERT INTO public.realm_attribute VALUES ('minimumQuickLoginWaitSeconds', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '60');
INSERT INTO public.realm_attribute VALUES ('waitIncrementSeconds', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '60');
INSERT INTO public.realm_attribute VALUES ('quickLoginCheckMilliSeconds', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '1000');
INSERT INTO public.realm_attribute VALUES ('maxDeltaTimeSeconds', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '43200');
INSERT INTO public.realm_attribute VALUES ('failureFactor', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '30');
INSERT INTO public.realm_attribute VALUES ('realmReusableOtpCode', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'false');
INSERT INTO public.realm_attribute VALUES ('defaultSignatureAlgorithm', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'RS256');
INSERT INTO public.realm_attribute VALUES ('offlineSessionMaxLifespanEnabled', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'false');
INSERT INTO public.realm_attribute VALUES ('offlineSessionMaxLifespan', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '5184000');
INSERT INTO public.realm_attribute VALUES ('actionTokenGeneratedByAdminLifespan', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '43200');
INSERT INTO public.realm_attribute VALUES ('actionTokenGeneratedByUserLifespan', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '300');
INSERT INTO public.realm_attribute VALUES ('oauth2DeviceCodeLifespan', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '600');
INSERT INTO public.realm_attribute VALUES ('oauth2DevicePollingInterval', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '5');
INSERT INTO public.realm_attribute VALUES ('webAuthnPolicyRpEntityName', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'keycloak');
INSERT INTO public.realm_attribute VALUES ('webAuthnPolicySignatureAlgorithms', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'ES256,RS256');
INSERT INTO public.realm_attribute VALUES ('webAuthnPolicyRpId', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '');
INSERT INTO public.realm_attribute VALUES ('webAuthnPolicyAttestationConveyancePreference', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'not specified');
INSERT INTO public.realm_attribute VALUES ('webAuthnPolicyAuthenticatorAttachment', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'not specified');
INSERT INTO public.realm_attribute VALUES ('webAuthnPolicyRequireResidentKey', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'not specified');
INSERT INTO public.realm_attribute VALUES ('webAuthnPolicyUserVerificationRequirement', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'not specified');
INSERT INTO public.realm_attribute VALUES ('webAuthnPolicyCreateTimeout', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '0');
INSERT INTO public.realm_attribute VALUES ('webAuthnPolicyAvoidSameAuthenticatorRegister', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'false');
INSERT INTO public.realm_attribute VALUES ('webAuthnPolicyRpEntityNamePasswordless', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'keycloak');
INSERT INTO public.realm_attribute VALUES ('webAuthnPolicySignatureAlgorithmsPasswordless', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'ES256,RS256');
INSERT INTO public.realm_attribute VALUES ('webAuthnPolicyRpIdPasswordless', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '');
INSERT INTO public.realm_attribute VALUES ('webAuthnPolicyAttestationConveyancePreferencePasswordless', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'not specified');
INSERT INTO public.realm_attribute VALUES ('webAuthnPolicyAuthenticatorAttachmentPasswordless', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'not specified');
INSERT INTO public.realm_attribute VALUES ('webAuthnPolicyRequireResidentKeyPasswordless', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'Yes');
INSERT INTO public.realm_attribute VALUES ('webAuthnPolicyUserVerificationRequirementPasswordless', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'required');
INSERT INTO public.realm_attribute VALUES ('webAuthnPolicyCreateTimeoutPasswordless', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '0');
INSERT INTO public.realm_attribute VALUES ('webAuthnPolicyAvoidSameAuthenticatorRegisterPasswordless', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'false');
INSERT INTO public.realm_attribute VALUES ('cibaBackchannelTokenDeliveryMode', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'poll');
INSERT INTO public.realm_attribute VALUES ('cibaExpiresIn', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '120');
INSERT INTO public.realm_attribute VALUES ('cibaInterval', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '5');
INSERT INTO public.realm_attribute VALUES ('cibaAuthRequestedUserHint', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'login_hint');
INSERT INTO public.realm_attribute VALUES ('parRequestUriLifespan', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '60');
INSERT INTO public.realm_attribute VALUES ('firstBrokerLoginFlowId', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '60508573-3af1-4a51-990f-2b51c9f74b09');
INSERT INTO public.realm_attribute VALUES ('organizationsEnabled', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'false');
INSERT INTO public.realm_attribute VALUES ('adminPermissionsEnabled', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'false');
INSERT INTO public.realm_attribute VALUES ('verifiableCredentialsEnabled', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'false');
INSERT INTO public.realm_attribute VALUES ('clientSessionIdleTimeout', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '0');
INSERT INTO public.realm_attribute VALUES ('clientSessionMaxLifespan', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '0');
INSERT INTO public.realm_attribute VALUES ('clientOfflineSessionIdleTimeout', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '0');
INSERT INTO public.realm_attribute VALUES ('clientOfflineSessionMaxLifespan', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '0');
INSERT INTO public.realm_attribute VALUES ('client-policies.profiles', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '{"profiles":[]}');
INSERT INTO public.realm_attribute VALUES ('client-policies.policies', '000c9ecc-9c3a-44d3-94fe-941ff152490f', '{"policies":[]}');


--
-- TOC entry 4263 (class 0 OID 16680)
-- Dependencies: 266
-- Data for Name: realm_default_groups; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4264 (class 0 OID 16683)
-- Dependencies: 267
-- Data for Name: realm_enabled_event_types; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4265 (class 0 OID 16686)
-- Dependencies: 268
-- Data for Name: realm_events_listeners; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.realm_events_listeners VALUES ('0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'jboss-logging');
INSERT INTO public.realm_events_listeners VALUES ('000c9ecc-9c3a-44d3-94fe-941ff152490f', 'jboss-logging');


--
-- TOC entry 4266 (class 0 OID 16689)
-- Dependencies: 269
-- Data for Name: realm_localizations; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4267 (class 0 OID 16694)
-- Dependencies: 270
-- Data for Name: realm_required_credential; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.realm_required_credential VALUES ('password', 'password', true, true, '0666ea4e-c88f-4e30-bf74-4874c0b2484d');
INSERT INTO public.realm_required_credential VALUES ('password', 'password', true, true, '000c9ecc-9c3a-44d3-94fe-941ff152490f');


--
-- TOC entry 4268 (class 0 OID 16701)
-- Dependencies: 271
-- Data for Name: realm_smtp_config; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4269 (class 0 OID 16706)
-- Dependencies: 272
-- Data for Name: realm_supported_locales; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4270 (class 0 OID 16709)
-- Dependencies: 273
-- Data for Name: redirect_uris; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.redirect_uris VALUES ('0b148250-d1c8-45d5-836c-b324e24f2f58', '/realms/master/account/*');
INSERT INTO public.redirect_uris VALUES ('5e3fa378-9c17-4fea-a010-658a9422c2c9', '/realms/master/account/*');
INSERT INTO public.redirect_uris VALUES ('46c97fed-5865-497a-90cc-eeb6a263032a', '/admin/master/console/*');
INSERT INTO public.redirect_uris VALUES ('09f537ab-f042-4fdc-90e5-93431b52d758', '/realms/alumnet-realm/account/*');
INSERT INTO public.redirect_uris VALUES ('0755204d-499f-4aa8-9844-73c138cd6e72', '/realms/alumnet-realm/account/*');
INSERT INTO public.redirect_uris VALUES ('f386953e-2fb0-4093-b0a6-bc07803ce34e', '/admin/alumnet-realm/console/*');
INSERT INTO public.redirect_uris VALUES ('b9a6b3be-9f94-4272-8e8e-a71b8b9050bb', 'alumnet.mobile://login*');
INSERT INTO public.redirect_uris VALUES ('b9a6b3be-9f94-4272-8e8e-a71b8b9050bb', 'alumnet.mobile://redirect*');
INSERT INTO public.redirect_uris VALUES ('b9a6b3be-9f94-4272-8e8e-a71b8b9050bb', 'alumnet.mobile://redirect');
INSERT INTO public.redirect_uris VALUES ('b9a6b3be-9f94-4272-8e8e-a71b8b9050bb', 'alumnet.mobile://login');


--
-- TOC entry 4271 (class 0 OID 16712)
-- Dependencies: 274
-- Data for Name: required_action_config; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4272 (class 0 OID 16717)
-- Dependencies: 275
-- Data for Name: required_action_provider; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.required_action_provider VALUES ('d90aefc9-3560-4e8c-ac6b-302bb14ee6db', 'VERIFY_EMAIL', 'Verify Email', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', true, false, 'VERIFY_EMAIL', 50);
INSERT INTO public.required_action_provider VALUES ('1808e5da-1c62-40ff-869b-e3067fd30b3d', 'UPDATE_PROFILE', 'Update Profile', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', true, false, 'UPDATE_PROFILE', 40);
INSERT INTO public.required_action_provider VALUES ('ecc9a01e-5c89-437a-b73b-ab5627eb6902', 'CONFIGURE_TOTP', 'Configure OTP', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', true, false, 'CONFIGURE_TOTP', 10);
INSERT INTO public.required_action_provider VALUES ('d0b96276-5ab0-4e54-b09f-4f4336791da6', 'UPDATE_PASSWORD', 'Update Password', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', true, false, 'UPDATE_PASSWORD', 30);
INSERT INTO public.required_action_provider VALUES ('04b657fc-7269-40fb-a7b0-64a346d3984a', 'TERMS_AND_CONDITIONS', 'Terms and Conditions', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', false, false, 'TERMS_AND_CONDITIONS', 20);
INSERT INTO public.required_action_provider VALUES ('98cfffaf-ba7e-4323-a54d-5f7de32ae84d', 'delete_account', 'Delete Account', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', false, false, 'delete_account', 60);
INSERT INTO public.required_action_provider VALUES ('97c6935f-e8e6-4a9b-aad6-62b33f8a8025', 'delete_credential', 'Delete Credential', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', true, false, 'delete_credential', 110);
INSERT INTO public.required_action_provider VALUES ('a320dcee-c7a8-4274-a353-3f0e76eaedbd', 'update_user_locale', 'Update User Locale', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', true, false, 'update_user_locale', 1000);
INSERT INTO public.required_action_provider VALUES ('39a7e335-d09a-4ba8-b484-f42d6ca54662', 'UPDATE_EMAIL', 'Update Email', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', false, false, 'UPDATE_EMAIL', 70);
INSERT INTO public.required_action_provider VALUES ('19998dd4-585a-4575-a14d-716d910b3ce0', 'CONFIGURE_RECOVERY_AUTHN_CODES', 'Recovery Authentication Codes', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', true, false, 'CONFIGURE_RECOVERY_AUTHN_CODES', 130);
INSERT INTO public.required_action_provider VALUES ('392bb71c-9fa3-4ad9-be04-01e5586d728e', 'webauthn-register', 'Webauthn Register', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', true, false, 'webauthn-register', 80);
INSERT INTO public.required_action_provider VALUES ('0da6fd8e-1b42-4bdd-aa36-fdd7ccc992a1', 'webauthn-register-passwordless', 'Webauthn Register Passwordless', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', true, false, 'webauthn-register-passwordless', 90);
INSERT INTO public.required_action_provider VALUES ('d3c43096-8ad1-41b4-b432-cf04c8e4ff92', 'VERIFY_PROFILE', 'Verify Profile', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', true, false, 'VERIFY_PROFILE', 100);
INSERT INTO public.required_action_provider VALUES ('d04b82dd-a1c0-4957-8987-08863cac8d7d', 'idp_link', 'Linking Identity Provider', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', true, false, 'idp_link', 120);
INSERT INTO public.required_action_provider VALUES ('7108d381-0265-4041-bd89-a3925157b7c4', 'TERMS_AND_CONDITIONS', 'Terms and Conditions', '000c9ecc-9c3a-44d3-94fe-941ff152490f', false, false, 'TERMS_AND_CONDITIONS', 20);
INSERT INTO public.required_action_provider VALUES ('9b3a3196-6195-402c-9ccb-a2ccab73776c', 'delete_account', 'Delete Account', '000c9ecc-9c3a-44d3-94fe-941ff152490f', false, false, 'delete_account', 60);
INSERT INTO public.required_action_provider VALUES ('356b65bd-535b-4fce-a2f8-aefc3eccd5ef', 'UPDATE_EMAIL', 'Update Email', '000c9ecc-9c3a-44d3-94fe-941ff152490f', false, false, 'UPDATE_EMAIL', 70);
INSERT INTO public.required_action_provider VALUES ('69434df8-9a82-4c61-a952-85ec584092bb', 'CONFIGURE_TOTP', 'Configure OTP', '000c9ecc-9c3a-44d3-94fe-941ff152490f', false, false, 'CONFIGURE_TOTP', 10);
INSERT INTO public.required_action_provider VALUES ('cee7023c-ed19-4d8a-83ba-9845e77155dd', 'UPDATE_PROFILE', 'Update Profile', '000c9ecc-9c3a-44d3-94fe-941ff152490f', false, false, 'UPDATE_PROFILE', 40);
INSERT INTO public.required_action_provider VALUES ('266d5016-d4d2-4508-8584-12eb604a66a5', 'VERIFY_EMAIL', 'Verify Email', '000c9ecc-9c3a-44d3-94fe-941ff152490f', false, false, 'VERIFY_EMAIL', 50);
INSERT INTO public.required_action_provider VALUES ('4f30cf3b-b531-4901-abcd-9a1f5ee5bc6a', 'webauthn-register', 'Webauthn Register', '000c9ecc-9c3a-44d3-94fe-941ff152490f', false, false, 'webauthn-register', 80);
INSERT INTO public.required_action_provider VALUES ('bebadb5c-1eca-481f-a10a-edd566600c3e', 'webauthn-register-passwordless', 'Webauthn Register Passwordless', '000c9ecc-9c3a-44d3-94fe-941ff152490f', false, false, 'webauthn-register-passwordless', 90);
INSERT INTO public.required_action_provider VALUES ('a8c29d4e-7a29-4e19-8d00-fb8d47efb6c6', 'VERIFY_PROFILE', 'Verify Profile', '000c9ecc-9c3a-44d3-94fe-941ff152490f', false, false, 'VERIFY_PROFILE', 100);
INSERT INTO public.required_action_provider VALUES ('50a7ad8a-95ff-482b-86fe-ed73aaa05531', 'delete_credential', 'Delete Credential', '000c9ecc-9c3a-44d3-94fe-941ff152490f', false, false, 'delete_credential', 110);
INSERT INTO public.required_action_provider VALUES ('3baccd3b-786f-4aef-9a90-e1136f2e4564', 'idp_link', 'Linking Identity Provider', '000c9ecc-9c3a-44d3-94fe-941ff152490f', false, false, 'idp_link', 120);
INSERT INTO public.required_action_provider VALUES ('5491e61e-5b00-4356-8d6e-ac7ebeb9c926', 'CONFIGURE_RECOVERY_AUTHN_CODES', 'Recovery Authentication Codes', '000c9ecc-9c3a-44d3-94fe-941ff152490f', false, false, 'CONFIGURE_RECOVERY_AUTHN_CODES', 130);
INSERT INTO public.required_action_provider VALUES ('f9572e72-74b6-49c2-80d6-b57a21e7a2a2', 'update_user_locale', 'Update User Locale', '000c9ecc-9c3a-44d3-94fe-941ff152490f', false, false, 'update_user_locale', 1000);
INSERT INTO public.required_action_provider VALUES ('447839cd-5b30-47f2-9f37-5d6e7e1aaca2', 'UPDATE_PASSWORD', 'Update Password', '000c9ecc-9c3a-44d3-94fe-941ff152490f', true, false, 'UPDATE_PASSWORD', 30);


--
-- TOC entry 4273 (class 0 OID 16724)
-- Dependencies: 276
-- Data for Name: resource_attribute; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4274 (class 0 OID 16730)
-- Dependencies: 277
-- Data for Name: resource_policy; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4275 (class 0 OID 16733)
-- Dependencies: 278
-- Data for Name: resource_scope; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4276 (class 0 OID 16736)
-- Dependencies: 279
-- Data for Name: resource_server; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4277 (class 0 OID 16741)
-- Dependencies: 280
-- Data for Name: resource_server_perm_ticket; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4278 (class 0 OID 16746)
-- Dependencies: 281
-- Data for Name: resource_server_policy; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4279 (class 0 OID 16751)
-- Dependencies: 282
-- Data for Name: resource_server_resource; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4280 (class 0 OID 16757)
-- Dependencies: 283
-- Data for Name: resource_server_scope; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4281 (class 0 OID 16762)
-- Dependencies: 284
-- Data for Name: resource_uris; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4282 (class 0 OID 16765)
-- Dependencies: 285
-- Data for Name: revoked_token; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4283 (class 0 OID 16768)
-- Dependencies: 286
-- Data for Name: role_attribute; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4284 (class 0 OID 16773)
-- Dependencies: 287
-- Data for Name: scope_mapping; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.scope_mapping VALUES ('5e3fa378-9c17-4fea-a010-658a9422c2c9', '7d606dfa-83ae-4fd6-b145-669374409aeb');
INSERT INTO public.scope_mapping VALUES ('5e3fa378-9c17-4fea-a010-658a9422c2c9', 'b95c529b-ef8d-44f5-bd1f-47086213315b');
INSERT INTO public.scope_mapping VALUES ('0755204d-499f-4aa8-9844-73c138cd6e72', '5d9a4233-4be8-4091-bdf1-c1bfd736d4c9');
INSERT INTO public.scope_mapping VALUES ('0755204d-499f-4aa8-9844-73c138cd6e72', 'e1972537-b603-4513-8723-e87bedb2e453');


--
-- TOC entry 4285 (class 0 OID 16776)
-- Dependencies: 288
-- Data for Name: scope_policy; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4286 (class 0 OID 16779)
-- Dependencies: 289
-- Data for Name: server_config; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.server_config VALUES ('crt_jgroups', '{"prvKey":"MIIEogIBAAKCAQEAqy45qOB3jHX0/w5eQzvzlvQNDG/hs9wPJjxMbsIyoFJUNYSXyUDg+XY8VnFPeSQ5rzUYLBsEonTrtqjYgHqT9iOEcHV0dQiwv46F0joRHsaoKdAD2V+0oXRkmwuOozQMd8OVU+RJx9/fteGnrsX2uDsSXSjFS/NOJhv9NteFGeKCat2pTcwlLp/UjLITPUSmKYjfu9W6JpD37Wb92rQ7jEmoCAoeKbZp86Lflwaxj4JCQpRyJUFjZjpqesO8T6+BRliF4UkVZ7/v1Lvp+uDXhW9fwYCUR943c6r09uDOiT1PuJsGy0EXWU1OHJj9gwHgUhozlsmMQT/cpRTMC34biQIDAQABAoIBAAJuhq0qeyhIqLFS3+3ulRhI4UKS+E7YynJNmvxbz+JNKRsVhh56yHdiwZqsw2dCJ3ugsnY18Avqw0p1/ZVdqGpvuLrsQDpFZFVkTexdnM6mHc9yQAu/e05r294D/QO+gorVAXMOpCmtuXzY9svZzhZx6GHgaWUZ0Ltj3GYCC8cBVcv7CQv+GbW65gueVFLOQ7L+swQ60tuz97F9F7yStmkHaPGcxer0VLUdwNvwOMkDqXww1+M+TZrdXtxrWYCl/dxkp2WKqZaSr0UQ27e4QaRSeS2zghIiHSII23qIqg5/wpSaPXyggJDWA7PfIE2nURlNLKgxnNXu348ZcCAZQTECgYEA1gQmUfeGaRGL88paaHLK/ytI15Y+Qwjdb5sN4+dnGXy3OHB7iM4/5PdpA8IYXv5g6Lnldf4G92Nx942B4mZCDL3LTXgIu8tZvE37RiHMaRSdNH9WpGtfpTi6weQ+lja02dNtC7IO/6X4/X9NSnQ5QHXqO0bsNnemN4GNNLMdj20CgYEAzMLg2sQ4njAokAzB0p/3ueUeNPyqI6eCwNc4Cus0HXUWJ9FhESuMnDwrBFZryUpW1QmOPdkVV53f5aX7NGDnrZ87nHKVjldOUmRYfBfH47H1OlV/hCuiy2JDGart80JcKwC56uladexdPaww+px/0xwuVOBtI1E98Za+hiY6Pw0CgYBpjM5hapSNySue5tPD46meQ3i/asf2Q68CVhR5rCy68zlhyogCpsX4ZNUUF2vxnb+px9UVZl2FMTSKBO5j/E7i/dAAuwyDofz10/fzVMP9pz8JHyxaFuKrF9lzut/rMbvsGkwTkpO3HeI5E8nIyJ1b30vQRGBHVKdThL9hmF0h2QKBgHWio/Gq92gR/Mu9OIEb/AMlWTRR0CFJtDm7q2vCcp9VzBO2G5D0twRvILuONsBe4AHmSnzHwZYjkiTqNaaC4bcCmwmnXrp29/0nvxoTw3fRnjQUOH0jYJR98FTHuYqenjrqYOVPiPPkhjDPQxhHXrxXHVsP0EORAghQdUa2oZHlAoGATTvADFwBQjaxrs4NDgH4SYlPFnO4014gYogsI9qCveAEoiXB8IRV0JZ1H9xZVoTQT/I09gGWY7GohyKBGSiAKuaYjdPny2D2KsIkkuLQIV6xf7+9j7X9LwJH3WJyeK1U6xpfAexbil5MuvslB39mktAxAjQNAHcEcBWpT7cnYJo=","pubKey":"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqy45qOB3jHX0/w5eQzvzlvQNDG/hs9wPJjxMbsIyoFJUNYSXyUDg+XY8VnFPeSQ5rzUYLBsEonTrtqjYgHqT9iOEcHV0dQiwv46F0joRHsaoKdAD2V+0oXRkmwuOozQMd8OVU+RJx9/fteGnrsX2uDsSXSjFS/NOJhv9NteFGeKCat2pTcwlLp/UjLITPUSmKYjfu9W6JpD37Wb92rQ7jEmoCAoeKbZp86Lflwaxj4JCQpRyJUFjZjpqesO8T6+BRliF4UkVZ7/v1Lvp+uDXhW9fwYCUR943c6r09uDOiT1PuJsGy0EXWU1OHJj9gwHgUhozlsmMQT/cpRTMC34biQIDAQAB","crt":"MIICnTCCAYUCBgGZ5HttdjANBgkqhkiG9w0BAQsFADASMRAwDgYDVQQDDAdqZ3JvdXBzMB4XDTI1MTAxNDIwNDY1OFoXDTI1MTIxMzIwNDgzOFowEjEQMA4GA1UEAwwHamdyb3VwczCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKsuOajgd4x19P8OXkM785b0DQxv4bPcDyY8TG7CMqBSVDWEl8lA4Pl2PFZxT3kkOa81GCwbBKJ067ao2IB6k/YjhHB1dHUIsL+OhdI6ER7GqCnQA9lftKF0ZJsLjqM0DHfDlVPkScff37Xhp67F9rg7El0oxUvzTiYb/TbXhRnigmrdqU3MJS6f1IyyEz1EpimI37vVuiaQ9+1m/dq0O4xJqAgKHim2afOi35cGsY+CQkKUciVBY2Y6anrDvE+vgUZYheFJFWe/79S76frg14VvX8GAlEfeN3Oq9Pbgzok9T7ibBstBF1lNThyY/YMB4FIaM5bJjEE/3KUUzAt+G4kCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAXkhOiVbRBlXmqhrBohnk7kuCDFfb+cBBQs2Mxj84qwFKZC/MMbDIZ5mJfbUlTfaXInGQJj83rX9JkF9QkPcB6Ut7TBMV2AWPoXpm6QSnYbdjuUnuk2Edj6PiDSydZJ7lca+xKxwNu9YZ7sjWUzfKvZqZaEaDV2/Lo7t/MkHjRnRn+AsgfBklTx/Dq/TQ0TAySushizUvEGwAsJPfFT8E7hbyFIB7IOWbz3TpJnnMTCZHfg6oMXZHm+rU2nM0eQkFCE3ruyNP4gE5uww50GMQP1OJ2CKo5ALKXVFOUeISItA9JpXp+/UEFTkyv9jd7aVfwXKhwChPA/pEnxLwDO5Maw==","alias":"b2224341-7b42-47e3-a01e-298b26cb36e2","generatedMillis":1760474918319}', 0);
INSERT INTO public.server_config VALUES ('JGROUPS_ADDRESS_SEQUENCE', '8', 8);


--
-- TOC entry 4287 (class 0 OID 16785)
-- Dependencies: 290
-- Data for Name: user_attribute; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4288 (class 0 OID 16791)
-- Dependencies: 291
-- Data for Name: user_consent; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4289 (class 0 OID 16796)
-- Dependencies: 292
-- Data for Name: user_consent_client_scope; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4290 (class 0 OID 16799)
-- Dependencies: 293
-- Data for Name: user_entity; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.user_entity VALUES ('017b322f-033a-4d6c-a258-8ca95786e66e', NULL, '417046a4-2779-483d-ac7e-40be57648d5f', false, true, NULL, NULL, NULL, '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'develop', 1760475824153, NULL, 0);
INSERT INTO public.user_entity VALUES ('59d446ec-8c0a-48b4-9785-14f26007ddbf', 'roma.student@alumnet.com', 'roma.student@alumnet.com', true, true, NULL, 'Roma', 'Marccielo', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'roma.student@alumnet.com', 1760476294956, NULL, 0);
INSERT INTO public.user_entity VALUES ('467fca2a-add9-4201-ab6b-ecd48914da54', 'roman.teacher@alumnet.com', 'roman.teacher@alumnet.com', true, true, NULL, 'Roman', 'Rodriguez', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'roman.teacher@alumnet.com', 1760476113872, NULL, 0);
INSERT INTO public.user_entity VALUES ('4c0a6f96-ef5e-4a79-9dc4-581d694cb03f', 'ramon.admin@alumnet.com', 'ramon.admin@alumnet.com', true, true, NULL, 'Ramon', 'Fernandez', '000c9ecc-9c3a-44d3-94fe-941ff152490f', 'ramon.admin@alumnet.com', 1760476252537, NULL, 0);
INSERT INTO public.user_entity VALUES ('7a7ffec9-1041-4c28-8fec-f8e958db8bbf', 'federicomaciel.dev@gmail.com', 'federicomaciel.dev@gmail.com', true, true, NULL, 'fede', 'maciel', '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'federicomaciel.dev@gmail.com', 1760559001885, NULL, 0);
INSERT INTO public.user_entity VALUES ('dbd69f1a-4a1a-4797-972b-ec0494972068', NULL, 'fdc94f9a-149e-4365-b86d-0d40f585a8d5', true, true, NULL, NULL, NULL, '0666ea4e-c88f-4e30-bf74-4874c0b2484d', 'admin', 1760568798500, NULL, 0);


--
-- TOC entry 4291 (class 0 OID 16807)
-- Dependencies: 294
-- Data for Name: user_federation_config; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4292 (class 0 OID 16812)
-- Dependencies: 295
-- Data for Name: user_federation_mapper; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4293 (class 0 OID 16817)
-- Dependencies: 296
-- Data for Name: user_federation_mapper_config; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4294 (class 0 OID 16822)
-- Dependencies: 297
-- Data for Name: user_federation_provider; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4295 (class 0 OID 16827)
-- Dependencies: 298
-- Data for Name: user_group_membership; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.user_group_membership VALUES ('ea0097c4-3325-494e-904b-ef6fef8c9ddb', '467fca2a-add9-4201-ab6b-ecd48914da54', 'UNMANAGED');
INSERT INTO public.user_group_membership VALUES ('0a9fda05-f683-4ad3-bf5c-e5000da2ee6a', '4c0a6f96-ef5e-4a79-9dc4-581d694cb03f', 'UNMANAGED');
INSERT INTO public.user_group_membership VALUES ('caf0000d-bab0-4414-9096-2430000ac9b1', '59d446ec-8c0a-48b4-9785-14f26007ddbf', 'UNMANAGED');


--
-- TOC entry 4296 (class 0 OID 16830)
-- Dependencies: 299
-- Data for Name: user_required_action; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 4297 (class 0 OID 16834)
-- Dependencies: 300
-- Data for Name: user_role_mapping; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.user_role_mapping VALUES ('83d02c9a-4d21-4e86-b3a5-c4772f85ec6a', '017b322f-033a-4d6c-a258-8ca95786e66e');
INSERT INTO public.user_role_mapping VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', '017b322f-033a-4d6c-a258-8ca95786e66e');
INSERT INTO public.user_role_mapping VALUES ('b2132454-dffa-40df-838e-3e33b208644f', '017b322f-033a-4d6c-a258-8ca95786e66e');
INSERT INTO public.user_role_mapping VALUES ('a0219b69-16e6-4455-a1ac-f04e2a236a21', '017b322f-033a-4d6c-a258-8ca95786e66e');
INSERT INTO public.user_role_mapping VALUES ('a094f044-1586-4448-b116-3d30223d17fb', '017b322f-033a-4d6c-a258-8ca95786e66e');
INSERT INTO public.user_role_mapping VALUES ('0fc1515d-32eb-4643-b9e9-646337839092', '467fca2a-add9-4201-ab6b-ecd48914da54');
INSERT INTO public.user_role_mapping VALUES ('0fc1515d-32eb-4643-b9e9-646337839092', '4c0a6f96-ef5e-4a79-9dc4-581d694cb03f');
INSERT INTO public.user_role_mapping VALUES ('0fc1515d-32eb-4643-b9e9-646337839092', '59d446ec-8c0a-48b4-9785-14f26007ddbf');
INSERT INTO public.user_role_mapping VALUES ('83d02c9a-4d21-4e86-b3a5-c4772f85ec6a', '7a7ffec9-1041-4c28-8fec-f8e958db8bbf');
INSERT INTO public.user_role_mapping VALUES ('83d02c9a-4d21-4e86-b3a5-c4772f85ec6a', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('ce17e30f-1745-49ec-a4e0-8e29422c83d8', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('b2132454-dffa-40df-838e-3e33b208644f', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('a0219b69-16e6-4455-a1ac-f04e2a236a21', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('a094f044-1586-4448-b116-3d30223d17fb', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('3e48e728-f874-4e1f-b04f-7e9dcd067f10', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('d8ded547-7d41-45e7-8b23-afdffccd6b3d', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('94b1c888-87d1-42d7-800e-394728dff586', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('82e8e12e-0fea-4e53-928d-bf2bf3dbbfb0', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('b95c529b-ef8d-44f5-bd1f-47086213315b', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('252664c3-be38-45a1-9b54-4aab298efebb', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('6ecee205-0556-4b16-821b-7b7966ff5aa3', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('7d606dfa-83ae-4fd6-b145-669374409aeb', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('408d0cfa-f8ce-4c05-ba7f-dec9bd2f4e96', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('6792f9a3-3403-4275-8837-0d545d88f733', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('ce317b98-57bd-42a3-9c5c-9e7cfa251ffe', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('184274b4-465f-488e-a749-0e637b189160', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('70cd2784-d68e-4e35-9484-b6dcd23efd61', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('a3c1321a-81aa-4c38-9457-0fc0e6aaa38f', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('86ac1f47-c9c3-496f-ac21-085e5c3f3eb8', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('cae3c546-c55a-461d-935b-4be9d51908e6', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('9ba15469-de14-41f9-bcd1-414eb48e1a9b', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('b048a423-d753-4aab-96d2-7ccd2c95df3c', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('24553704-44e0-471d-b658-08468aa95a9b', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('f84e5f2a-426c-480c-af6c-a761651fe8e6', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('ca9bb414-b703-46f3-8e7d-4a51c3737765', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('b2ff4369-7e5f-4f20-aef4-2764ddeaa3e4', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('aec83f14-d848-4342-8baf-0d3315d64503', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('398283d5-3e77-4fcc-aa45-3b230886f441', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('b04d8676-b711-42ec-bc86-ceed0bd5d485', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('039eb199-78d8-4477-808f-cb22d297afce', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('938bcef4-4540-4c66-9ee2-77cfabca87b6', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('d6212e65-08f9-485f-9c21-b4edcc3c9fc7', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('8306760f-c0b3-4469-bedd-9c5fe077bb9d', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('8bc720dc-4b8f-4d3a-83ff-925e52e7e6a9', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('ff586ac2-3b94-4487-8bb8-63d98dbb16b3', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('6e79f3fa-e216-4384-bdc3-9ce95fce8b14', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('610438f2-3ea4-4429-b731-d60216d7f238', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('5c6c5f60-bb29-49d0-b151-51fdb8306e49', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('e41b30e3-875e-4a6c-8d39-2a32ae06d63b', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('f828f806-416b-4f7c-b254-cf4d93e2e7f5', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('4aae8d25-631f-4113-ba73-dac0102881d2', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('4cf8544f-937f-4f77-92c3-51bf5c9847f7', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('a8be5c2f-be83-41b8-9cb9-f35cc4ee82a1', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('aeceae38-c935-4f5c-8dec-6455461c925c', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('e195f23a-b529-42d7-af77-64e73199f801', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('274ab78e-1f1f-40bc-8e10-5458e91db17b', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('3d7dc8fc-820b-44bd-9b75-d39b972ef2b9', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('f22cac6b-f114-401d-9504-cfe1917dae1c', 'dbd69f1a-4a1a-4797-972b-ec0494972068');
INSERT INTO public.user_role_mapping VALUES ('d4801f2c-c1c0-4e24-bdba-e9a41dd21d93', 'dbd69f1a-4a1a-4797-972b-ec0494972068');


--
-- TOC entry 4298 (class 0 OID 16837)
-- Dependencies: 301
-- Data for Name: web_origins; Type: TABLE DATA; Schema: public; Owner: kc_user
--

INSERT INTO public.web_origins VALUES ('46c97fed-5865-497a-90cc-eeb6a263032a', '+');
INSERT INTO public.web_origins VALUES ('f386953e-2fb0-4093-b0a6-bc07803ce34e', '+');
INSERT INTO public.web_origins VALUES ('a17e62f0-27d3-4e2f-9362-451b9cc24dc3', '/*');


--
-- TOC entry 4299 (class 0 OID 16840)
-- Dependencies: 302
-- Data for Name: workflow_state; Type: TABLE DATA; Schema: public; Owner: kc_user
--



--
-- TOC entry 3855 (class 2606 OID 16847)
-- Name: org_domain ORG_DOMAIN_pkey; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.org_domain
    ADD CONSTRAINT "ORG_DOMAIN_pkey" PRIMARY KEY (id, name);


--
-- TOC entry 3847 (class 2606 OID 16849)
-- Name: org ORG_pkey; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.org
    ADD CONSTRAINT "ORG_pkey" PRIMARY KEY (id);


--
-- TOC entry 3947 (class 2606 OID 16851)
-- Name: server_config SERVER_CONFIG_pkey; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.server_config
    ADD CONSTRAINT "SERVER_CONFIG_pkey" PRIMARY KEY (server_config_key);


--
-- TOC entry 3827 (class 2606 OID 16853)
-- Name: keycloak_role UK_J3RWUVD56ONTGSUHOGM184WW2-2; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT "UK_J3RWUVD56ONTGSUHOGM184WW2-2" UNIQUE (name, client_realm_constraint);


--
-- TOC entry 3719 (class 2606 OID 16855)
-- Name: client_auth_flow_bindings c_cli_flow_bind; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.client_auth_flow_bindings
    ADD CONSTRAINT c_cli_flow_bind PRIMARY KEY (client_id, binding_name);


--
-- TOC entry 3734 (class 2606 OID 16857)
-- Name: client_scope_client c_cli_scope_bind; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.client_scope_client
    ADD CONSTRAINT c_cli_scope_bind PRIMARY KEY (client_id, scope_id);


--
-- TOC entry 3721 (class 2606 OID 16859)
-- Name: client_initial_access cnstr_client_init_acc_pk; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.client_initial_access
    ADD CONSTRAINT cnstr_client_init_acc_pk PRIMARY KEY (id);


--
-- TOC entry 3874 (class 2606 OID 16861)
-- Name: realm_default_groups con_group_id_def_groups; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT con_group_id_def_groups UNIQUE (group_id);


--
-- TOC entry 3709 (class 2606 OID 16863)
-- Name: broker_link constr_broker_link_pk; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.broker_link
    ADD CONSTRAINT constr_broker_link_pk PRIMARY KEY (identity_provider, user_id);


--
-- TOC entry 3746 (class 2606 OID 16865)
-- Name: component_config constr_component_config_pk; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.component_config
    ADD CONSTRAINT constr_component_config_pk PRIMARY KEY (id);


--
-- TOC entry 3742 (class 2606 OID 16867)
-- Name: component constr_component_pk; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.component
    ADD CONSTRAINT constr_component_pk PRIMARY KEY (id);


--
-- TOC entry 3786 (class 2606 OID 16869)
-- Name: fed_user_required_action constr_fed_required_action; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.fed_user_required_action
    ADD CONSTRAINT constr_fed_required_action PRIMARY KEY (required_action, user_id);


--
-- TOC entry 3766 (class 2606 OID 16871)
-- Name: fed_user_attribute constr_fed_user_attr_pk; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.fed_user_attribute
    ADD CONSTRAINT constr_fed_user_attr_pk PRIMARY KEY (id);


--
-- TOC entry 3771 (class 2606 OID 16873)
-- Name: fed_user_consent constr_fed_user_consent_pk; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.fed_user_consent
    ADD CONSTRAINT constr_fed_user_consent_pk PRIMARY KEY (id);


--
-- TOC entry 3778 (class 2606 OID 16875)
-- Name: fed_user_credential constr_fed_user_cred_pk; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.fed_user_credential
    ADD CONSTRAINT constr_fed_user_cred_pk PRIMARY KEY (id);


--
-- TOC entry 3782 (class 2606 OID 16877)
-- Name: fed_user_group_membership constr_fed_user_group; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.fed_user_group_membership
    ADD CONSTRAINT constr_fed_user_group PRIMARY KEY (group_id, user_id);


--
-- TOC entry 3790 (class 2606 OID 16879)
-- Name: fed_user_role_mapping constr_fed_user_role; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.fed_user_role_mapping
    ADD CONSTRAINT constr_fed_user_role PRIMARY KEY (role_id, user_id);


--
-- TOC entry 3798 (class 2606 OID 16881)
-- Name: federated_user constr_federated_user; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.federated_user
    ADD CONSTRAINT constr_federated_user PRIMARY KEY (id);


--
-- TOC entry 3876 (class 2606 OID 16883)
-- Name: realm_default_groups constr_realm_default_groups; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT constr_realm_default_groups PRIMARY KEY (realm_id, group_id);


--
-- TOC entry 3879 (class 2606 OID 16885)
-- Name: realm_enabled_event_types constr_realm_enabl_event_types; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.realm_enabled_event_types
    ADD CONSTRAINT constr_realm_enabl_event_types PRIMARY KEY (realm_id, value);


--
-- TOC entry 3882 (class 2606 OID 16887)
-- Name: realm_events_listeners constr_realm_events_listeners; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.realm_events_listeners
    ADD CONSTRAINT constr_realm_events_listeners PRIMARY KEY (realm_id, value);


--
-- TOC entry 3891 (class 2606 OID 16889)
-- Name: realm_supported_locales constr_realm_supported_locales; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.realm_supported_locales
    ADD CONSTRAINT constr_realm_supported_locales PRIMARY KEY (realm_id, value);


--
-- TOC entry 3807 (class 2606 OID 16891)
-- Name: identity_provider constraint_2b; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT constraint_2b PRIMARY KEY (internal_id);


--
-- TOC entry 3716 (class 2606 OID 16893)
-- Name: client_attributes constraint_3c; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.client_attributes
    ADD CONSTRAINT constraint_3c PRIMARY KEY (client_id, name);


--
-- TOC entry 3762 (class 2606 OID 16895)
-- Name: event_entity constraint_4; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.event_entity
    ADD CONSTRAINT constraint_4 PRIMARY KEY (id);


--
-- TOC entry 3794 (class 2606 OID 16897)
-- Name: federated_identity constraint_40; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.federated_identity
    ADD CONSTRAINT constraint_40 PRIMARY KEY (identity_provider, user_id);


--
-- TOC entry 3866 (class 2606 OID 16899)
-- Name: realm constraint_4a; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.realm
    ADD CONSTRAINT constraint_4a PRIMARY KEY (id);


--
-- TOC entry 3982 (class 2606 OID 16901)
-- Name: user_federation_provider constraint_5c; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_federation_provider
    ADD CONSTRAINT constraint_5c PRIMARY KEY (id);


--
-- TOC entry 3711 (class 2606 OID 16903)
-- Name: client constraint_7; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT constraint_7 PRIMARY KEY (id);


--
-- TOC entry 3941 (class 2606 OID 16905)
-- Name: scope_mapping constraint_81; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.scope_mapping
    ADD CONSTRAINT constraint_81 PRIMARY KEY (client_id, role_id);


--
-- TOC entry 3724 (class 2606 OID 16907)
-- Name: client_node_registrations constraint_84; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.client_node_registrations
    ADD CONSTRAINT constraint_84 PRIMARY KEY (client_id, name);


--
-- TOC entry 3871 (class 2606 OID 16909)
-- Name: realm_attribute constraint_9; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.realm_attribute
    ADD CONSTRAINT constraint_9 PRIMARY KEY (name, realm_id);


--
-- TOC entry 3887 (class 2606 OID 16911)
-- Name: realm_required_credential constraint_92; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.realm_required_credential
    ADD CONSTRAINT constraint_92 PRIMARY KEY (realm_id, type);


--
-- TOC entry 3829 (class 2606 OID 16913)
-- Name: keycloak_role constraint_a; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT constraint_a PRIMARY KEY (id);


--
-- TOC entry 3691 (class 2606 OID 16915)
-- Name: admin_event_entity constraint_admin_event_entity; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.admin_event_entity
    ADD CONSTRAINT constraint_admin_event_entity PRIMARY KEY (id);


--
-- TOC entry 3707 (class 2606 OID 16917)
-- Name: authenticator_config_entry constraint_auth_cfg_pk; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.authenticator_config_entry
    ADD CONSTRAINT constraint_auth_cfg_pk PRIMARY KEY (authenticator_id, name);


--
-- TOC entry 3697 (class 2606 OID 16919)
-- Name: authentication_execution constraint_auth_exec_pk; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT constraint_auth_exec_pk PRIMARY KEY (id);


--
-- TOC entry 3701 (class 2606 OID 16921)
-- Name: authentication_flow constraint_auth_flow_pk; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.authentication_flow
    ADD CONSTRAINT constraint_auth_flow_pk PRIMARY KEY (id);


--
-- TOC entry 3704 (class 2606 OID 16923)
-- Name: authenticator_config constraint_auth_pk; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.authenticator_config
    ADD CONSTRAINT constraint_auth_pk PRIMARY KEY (id);


--
-- TOC entry 3991 (class 2606 OID 16925)
-- Name: user_role_mapping constraint_c; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_role_mapping
    ADD CONSTRAINT constraint_c PRIMARY KEY (role_id, user_id);


--
-- TOC entry 3749 (class 2606 OID 16927)
-- Name: composite_role constraint_composite_role; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT constraint_composite_role PRIMARY KEY (composite, child_role);


--
-- TOC entry 3814 (class 2606 OID 16929)
-- Name: identity_provider_config constraint_d; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.identity_provider_config
    ADD CONSTRAINT constraint_d PRIMARY KEY (identity_provider_id, name);


--
-- TOC entry 3858 (class 2606 OID 16931)
-- Name: policy_config constraint_dpc; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.policy_config
    ADD CONSTRAINT constraint_dpc PRIMARY KEY (policy_id, name);


--
-- TOC entry 3889 (class 2606 OID 16933)
-- Name: realm_smtp_config constraint_e; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.realm_smtp_config
    ADD CONSTRAINT constraint_e PRIMARY KEY (realm_id, name);


--
-- TOC entry 3753 (class 2606 OID 16935)
-- Name: credential constraint_f; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.credential
    ADD CONSTRAINT constraint_f PRIMARY KEY (id);


--
-- TOC entry 3974 (class 2606 OID 16937)
-- Name: user_federation_config constraint_f9; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_federation_config
    ADD CONSTRAINT constraint_f9 PRIMARY KEY (user_federation_provider_id, name);


--
-- TOC entry 3912 (class 2606 OID 16939)
-- Name: resource_server_perm_ticket constraint_fapmt; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT constraint_fapmt PRIMARY KEY (id);


--
-- TOC entry 3923 (class 2606 OID 16941)
-- Name: resource_server_resource constraint_farsr; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT constraint_farsr PRIMARY KEY (id);


--
-- TOC entry 3918 (class 2606 OID 16943)
-- Name: resource_server_policy constraint_farsrp; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT constraint_farsrp PRIMARY KEY (id);


--
-- TOC entry 3694 (class 2606 OID 16945)
-- Name: associated_policy constraint_farsrpap; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT constraint_farsrpap PRIMARY KEY (policy_id, associated_policy_id);


--
-- TOC entry 3904 (class 2606 OID 16947)
-- Name: resource_policy constraint_farsrpp; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT constraint_farsrpp PRIMARY KEY (resource_id, policy_id);


--
-- TOC entry 3928 (class 2606 OID 16949)
-- Name: resource_server_scope constraint_farsrs; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT constraint_farsrs PRIMARY KEY (id);


--
-- TOC entry 3907 (class 2606 OID 16951)
-- Name: resource_scope constraint_farsrsp; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT constraint_farsrsp PRIMARY KEY (resource_id, scope_id);


--
-- TOC entry 3944 (class 2606 OID 16953)
-- Name: scope_policy constraint_farsrsps; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT constraint_farsrsps PRIMARY KEY (scope_id, policy_id);


--
-- TOC entry 3966 (class 2606 OID 16955)
-- Name: user_entity constraint_fb; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT constraint_fb PRIMARY KEY (id);


--
-- TOC entry 3980 (class 2606 OID 16957)
-- Name: user_federation_mapper_config constraint_fedmapper_cfg_pm; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_federation_mapper_config
    ADD CONSTRAINT constraint_fedmapper_cfg_pm PRIMARY KEY (user_federation_mapper_id, name);


--
-- TOC entry 3976 (class 2606 OID 16959)
-- Name: user_federation_mapper constraint_fedmapperpm; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT constraint_fedmapperpm PRIMARY KEY (id);


--
-- TOC entry 3776 (class 2606 OID 16961)
-- Name: fed_user_consent_cl_scope constraint_fgrntcsnt_clsc_pm; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.fed_user_consent_cl_scope
    ADD CONSTRAINT constraint_fgrntcsnt_clsc_pm PRIMARY KEY (user_consent_id, scope_id);


--
-- TOC entry 3962 (class 2606 OID 16963)
-- Name: user_consent_client_scope constraint_grntcsnt_clsc_pm; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_consent_client_scope
    ADD CONSTRAINT constraint_grntcsnt_clsc_pm PRIMARY KEY (user_consent_id, scope_id);


--
-- TOC entry 3955 (class 2606 OID 16965)
-- Name: user_consent constraint_grntcsnt_pm; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT constraint_grntcsnt_pm PRIMARY KEY (id);


--
-- TOC entry 3823 (class 2606 OID 16967)
-- Name: keycloak_group constraint_group; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.keycloak_group
    ADD CONSTRAINT constraint_group PRIMARY KEY (id);


--
-- TOC entry 3800 (class 2606 OID 16969)
-- Name: group_attribute constraint_group_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.group_attribute
    ADD CONSTRAINT constraint_group_attribute_pk PRIMARY KEY (id);


--
-- TOC entry 3804 (class 2606 OID 16971)
-- Name: group_role_mapping constraint_group_role; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.group_role_mapping
    ADD CONSTRAINT constraint_group_role PRIMARY KEY (role_id, group_id);


--
-- TOC entry 3816 (class 2606 OID 16973)
-- Name: identity_provider_mapper constraint_idpm; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.identity_provider_mapper
    ADD CONSTRAINT constraint_idpm PRIMARY KEY (id);


--
-- TOC entry 3819 (class 2606 OID 16975)
-- Name: idp_mapper_config constraint_idpmconfig; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.idp_mapper_config
    ADD CONSTRAINT constraint_idpmconfig PRIMARY KEY (idp_mapper_id, name);


--
-- TOC entry 3821 (class 2606 OID 16977)
-- Name: jgroups_ping constraint_jgroups_ping; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.jgroups_ping
    ADD CONSTRAINT constraint_jgroups_ping PRIMARY KEY (address);


--
-- TOC entry 3833 (class 2606 OID 16979)
-- Name: migration_model constraint_migmod; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.migration_model
    ADD CONSTRAINT constraint_migmod PRIMARY KEY (id);


--
-- TOC entry 3840 (class 2606 OID 16981)
-- Name: offline_client_session constraint_offl_cl_ses_pk3; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.offline_client_session
    ADD CONSTRAINT constraint_offl_cl_ses_pk3 PRIMARY KEY (user_session_id, client_id, client_storage_provider, external_client_id, offline_flag);


--
-- TOC entry 3842 (class 2606 OID 16983)
-- Name: offline_user_session constraint_offl_us_ses_pk2; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.offline_user_session
    ADD CONSTRAINT constraint_offl_us_ses_pk2 PRIMARY KEY (user_session_id, offline_flag);


--
-- TOC entry 3860 (class 2606 OID 16985)
-- Name: protocol_mapper constraint_pcm; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT constraint_pcm PRIMARY KEY (id);


--
-- TOC entry 3864 (class 2606 OID 16987)
-- Name: protocol_mapper_config constraint_pmconfig; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.protocol_mapper_config
    ADD CONSTRAINT constraint_pmconfig PRIMARY KEY (protocol_mapper_id, name);


--
-- TOC entry 3894 (class 2606 OID 16989)
-- Name: redirect_uris constraint_redirect_uris; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.redirect_uris
    ADD CONSTRAINT constraint_redirect_uris PRIMARY KEY (client_id, value);


--
-- TOC entry 3897 (class 2606 OID 16991)
-- Name: required_action_config constraint_req_act_cfg_pk; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.required_action_config
    ADD CONSTRAINT constraint_req_act_cfg_pk PRIMARY KEY (required_action_id, name);


--
-- TOC entry 3899 (class 2606 OID 16993)
-- Name: required_action_provider constraint_req_act_prv_pk; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.required_action_provider
    ADD CONSTRAINT constraint_req_act_prv_pk PRIMARY KEY (id);


--
-- TOC entry 3988 (class 2606 OID 16995)
-- Name: user_required_action constraint_required_action; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_required_action
    ADD CONSTRAINT constraint_required_action PRIMARY KEY (required_action, user_id);


--
-- TOC entry 3933 (class 2606 OID 16997)
-- Name: resource_uris constraint_resour_uris_pk; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_uris
    ADD CONSTRAINT constraint_resour_uris_pk PRIMARY KEY (resource_id, value);


--
-- TOC entry 3938 (class 2606 OID 16999)
-- Name: role_attribute constraint_role_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.role_attribute
    ADD CONSTRAINT constraint_role_attribute_pk PRIMARY KEY (id);


--
-- TOC entry 3935 (class 2606 OID 17001)
-- Name: revoked_token constraint_rt; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.revoked_token
    ADD CONSTRAINT constraint_rt PRIMARY KEY (id);


--
-- TOC entry 3949 (class 2606 OID 17003)
-- Name: user_attribute constraint_user_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_attribute
    ADD CONSTRAINT constraint_user_attribute_pk PRIMARY KEY (id);


--
-- TOC entry 3985 (class 2606 OID 17005)
-- Name: user_group_membership constraint_user_group; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_group_membership
    ADD CONSTRAINT constraint_user_group PRIMARY KEY (group_id, user_id);


--
-- TOC entry 3994 (class 2606 OID 17007)
-- Name: web_origins constraint_web_origins; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.web_origins
    ADD CONSTRAINT constraint_web_origins PRIMARY KEY (client_id, value);


--
-- TOC entry 3756 (class 2606 OID 17009)
-- Name: databasechangeloglock databasechangeloglock_pkey; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.databasechangeloglock
    ADD CONSTRAINT databasechangeloglock_pkey PRIMARY KEY (id);


--
-- TOC entry 3732 (class 2606 OID 17011)
-- Name: client_scope_attributes pk_cl_tmpl_attr; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.client_scope_attributes
    ADD CONSTRAINT pk_cl_tmpl_attr PRIMARY KEY (scope_id, name);


--
-- TOC entry 3727 (class 2606 OID 17013)
-- Name: client_scope pk_cli_template; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.client_scope
    ADD CONSTRAINT pk_cli_template PRIMARY KEY (id);


--
-- TOC entry 3910 (class 2606 OID 17015)
-- Name: resource_server pk_resource_server; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_server
    ADD CONSTRAINT pk_resource_server PRIMARY KEY (id);


--
-- TOC entry 3740 (class 2606 OID 17017)
-- Name: client_scope_role_mapping pk_template_scope; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.client_scope_role_mapping
    ADD CONSTRAINT pk_template_scope PRIMARY KEY (scope_id, role_id);


--
-- TOC entry 3999 (class 2606 OID 17019)
-- Name: workflow_state pk_workflow_state; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.workflow_state
    ADD CONSTRAINT pk_workflow_state PRIMARY KEY (execution_id);


--
-- TOC entry 3760 (class 2606 OID 17021)
-- Name: default_client_scope r_def_cli_scope_bind; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.default_client_scope
    ADD CONSTRAINT r_def_cli_scope_bind PRIMARY KEY (realm_id, scope_id);


--
-- TOC entry 3885 (class 2606 OID 17023)
-- Name: realm_localizations realm_localizations_pkey; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.realm_localizations
    ADD CONSTRAINT realm_localizations_pkey PRIMARY KEY (realm_id, locale);


--
-- TOC entry 3902 (class 2606 OID 17025)
-- Name: resource_attribute res_attr_pk; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_attribute
    ADD CONSTRAINT res_attr_pk PRIMARY KEY (id);


--
-- TOC entry 3825 (class 2606 OID 17027)
-- Name: keycloak_group sibling_names; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.keycloak_group
    ADD CONSTRAINT sibling_names UNIQUE (realm_id, parent_group, name);


--
-- TOC entry 3812 (class 2606 OID 17029)
-- Name: identity_provider uk_2daelwnibji49avxsrtuf6xj33; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT uk_2daelwnibji49avxsrtuf6xj33 UNIQUE (provider_alias, realm_id);


--
-- TOC entry 3714 (class 2606 OID 17031)
-- Name: client uk_b71cjlbenv945rb6gcon438at; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT uk_b71cjlbenv945rb6gcon438at UNIQUE (realm_id, client_id);


--
-- TOC entry 3729 (class 2606 OID 17033)
-- Name: client_scope uk_cli_scope; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.client_scope
    ADD CONSTRAINT uk_cli_scope UNIQUE (realm_id, name);


--
-- TOC entry 3970 (class 2606 OID 17035)
-- Name: user_entity uk_dykn684sl8up1crfei6eckhd7; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT uk_dykn684sl8up1crfei6eckhd7 UNIQUE (realm_id, email_constraint);


--
-- TOC entry 3958 (class 2606 OID 17037)
-- Name: user_consent uk_external_consent; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT uk_external_consent UNIQUE (client_storage_provider, external_client_id, user_id);


--
-- TOC entry 3926 (class 2606 OID 17039)
-- Name: resource_server_resource uk_frsr6t700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT uk_frsr6t700s9v50bu18ws5ha6 UNIQUE (name, owner, resource_server_id);


--
-- TOC entry 3916 (class 2606 OID 17041)
-- Name: resource_server_perm_ticket uk_frsr6t700s9v50bu18ws5pmt; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT uk_frsr6t700s9v50bu18ws5pmt UNIQUE (owner, requester, resource_server_id, resource_id, scope_id);


--
-- TOC entry 3921 (class 2606 OID 17043)
-- Name: resource_server_policy uk_frsrpt700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT uk_frsrpt700s9v50bu18ws5ha6 UNIQUE (name, resource_server_id);


--
-- TOC entry 3931 (class 2606 OID 17045)
-- Name: resource_server_scope uk_frsrst700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT uk_frsrst700s9v50bu18ws5ha6 UNIQUE (name, resource_server_id);


--
-- TOC entry 3960 (class 2606 OID 17047)
-- Name: user_consent uk_local_consent; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT uk_local_consent UNIQUE (client_id, user_id);


--
-- TOC entry 3836 (class 2606 OID 17049)
-- Name: migration_model uk_migration_update_time; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.migration_model
    ADD CONSTRAINT uk_migration_update_time UNIQUE (update_time);


--
-- TOC entry 3838 (class 2606 OID 17051)
-- Name: migration_model uk_migration_version; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.migration_model
    ADD CONSTRAINT uk_migration_version UNIQUE (version);


--
-- TOC entry 3849 (class 2606 OID 17053)
-- Name: org uk_org_alias; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.org
    ADD CONSTRAINT uk_org_alias UNIQUE (realm_id, alias);


--
-- TOC entry 3851 (class 2606 OID 17055)
-- Name: org uk_org_group; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.org
    ADD CONSTRAINT uk_org_group UNIQUE (group_id);


--
-- TOC entry 3853 (class 2606 OID 17057)
-- Name: org uk_org_name; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.org
    ADD CONSTRAINT uk_org_name UNIQUE (realm_id, name);


--
-- TOC entry 3869 (class 2606 OID 17059)
-- Name: realm uk_orvsdmla56612eaefiq6wl5oi; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.realm
    ADD CONSTRAINT uk_orvsdmla56612eaefiq6wl5oi UNIQUE (name);


--
-- TOC entry 3972 (class 2606 OID 17061)
-- Name: user_entity uk_ru8tt6t700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT uk_ru8tt6t700s9v50bu18ws5ha6 UNIQUE (realm_id, username);


--
-- TOC entry 4001 (class 2606 OID 17063)
-- Name: workflow_state uq_workflow_resource; Type: CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.workflow_state
    ADD CONSTRAINT uq_workflow_resource UNIQUE (workflow_id, resource_id);


--
-- TOC entry 3767 (class 1259 OID 17064)
-- Name: fed_user_attr_long_values; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX fed_user_attr_long_values ON public.fed_user_attribute USING btree (long_value_hash, name);


--
-- TOC entry 3768 (class 1259 OID 17065)
-- Name: fed_user_attr_long_values_lower_case; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX fed_user_attr_long_values_lower_case ON public.fed_user_attribute USING btree (long_value_hash_lower_case, name);


--
-- TOC entry 3692 (class 1259 OID 17066)
-- Name: idx_admin_event_time; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_admin_event_time ON public.admin_event_entity USING btree (realm_id, admin_event_time);


--
-- TOC entry 3695 (class 1259 OID 17067)
-- Name: idx_assoc_pol_assoc_pol_id; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_assoc_pol_assoc_pol_id ON public.associated_policy USING btree (associated_policy_id);


--
-- TOC entry 3705 (class 1259 OID 17068)
-- Name: idx_auth_config_realm; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_auth_config_realm ON public.authenticator_config USING btree (realm_id);


--
-- TOC entry 3698 (class 1259 OID 17069)
-- Name: idx_auth_exec_flow; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_auth_exec_flow ON public.authentication_execution USING btree (flow_id);


--
-- TOC entry 3699 (class 1259 OID 17070)
-- Name: idx_auth_exec_realm_flow; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_auth_exec_realm_flow ON public.authentication_execution USING btree (realm_id, flow_id);


--
-- TOC entry 3702 (class 1259 OID 17071)
-- Name: idx_auth_flow_realm; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_auth_flow_realm ON public.authentication_flow USING btree (realm_id);


--
-- TOC entry 3735 (class 1259 OID 17072)
-- Name: idx_cl_clscope; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_cl_clscope ON public.client_scope_client USING btree (scope_id);


--
-- TOC entry 3717 (class 1259 OID 17073)
-- Name: idx_client_att_by_name_value; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_client_att_by_name_value ON public.client_attributes USING btree (name, substr(value, 1, 255));


--
-- TOC entry 3712 (class 1259 OID 17074)
-- Name: idx_client_id; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_client_id ON public.client USING btree (client_id);


--
-- TOC entry 3722 (class 1259 OID 17075)
-- Name: idx_client_init_acc_realm; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_client_init_acc_realm ON public.client_initial_access USING btree (realm_id);


--
-- TOC entry 3730 (class 1259 OID 17076)
-- Name: idx_clscope_attrs; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_clscope_attrs ON public.client_scope_attributes USING btree (scope_id);


--
-- TOC entry 3736 (class 1259 OID 17077)
-- Name: idx_clscope_cl; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_clscope_cl ON public.client_scope_client USING btree (client_id);


--
-- TOC entry 3861 (class 1259 OID 17078)
-- Name: idx_clscope_protmap; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_clscope_protmap ON public.protocol_mapper USING btree (client_scope_id);


--
-- TOC entry 3737 (class 1259 OID 17079)
-- Name: idx_clscope_role; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_clscope_role ON public.client_scope_role_mapping USING btree (scope_id);


--
-- TOC entry 3747 (class 1259 OID 17080)
-- Name: idx_compo_config_compo; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_compo_config_compo ON public.component_config USING btree (component_id);


--
-- TOC entry 3743 (class 1259 OID 17081)
-- Name: idx_component_provider_type; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_component_provider_type ON public.component USING btree (provider_type);


--
-- TOC entry 3744 (class 1259 OID 17082)
-- Name: idx_component_realm; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_component_realm ON public.component USING btree (realm_id);


--
-- TOC entry 3750 (class 1259 OID 17083)
-- Name: idx_composite; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_composite ON public.composite_role USING btree (composite);


--
-- TOC entry 3751 (class 1259 OID 17084)
-- Name: idx_composite_child; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_composite_child ON public.composite_role USING btree (child_role);


--
-- TOC entry 3757 (class 1259 OID 17085)
-- Name: idx_defcls_realm; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_defcls_realm ON public.default_client_scope USING btree (realm_id);


--
-- TOC entry 3758 (class 1259 OID 17086)
-- Name: idx_defcls_scope; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_defcls_scope ON public.default_client_scope USING btree (scope_id);


--
-- TOC entry 3763 (class 1259 OID 17087)
-- Name: idx_event_entity_user_id_type; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_event_entity_user_id_type ON public.event_entity USING btree (user_id, type, event_time);


--
-- TOC entry 3764 (class 1259 OID 17088)
-- Name: idx_event_time; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_event_time ON public.event_entity USING btree (realm_id, event_time);


--
-- TOC entry 3795 (class 1259 OID 17089)
-- Name: idx_fedidentity_feduser; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_fedidentity_feduser ON public.federated_identity USING btree (federated_user_id);


--
-- TOC entry 3796 (class 1259 OID 17090)
-- Name: idx_fedidentity_user; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_fedidentity_user ON public.federated_identity USING btree (user_id);


--
-- TOC entry 3769 (class 1259 OID 17091)
-- Name: idx_fu_attribute; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_fu_attribute ON public.fed_user_attribute USING btree (user_id, realm_id, name);


--
-- TOC entry 3772 (class 1259 OID 17092)
-- Name: idx_fu_cnsnt_ext; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_fu_cnsnt_ext ON public.fed_user_consent USING btree (user_id, client_storage_provider, external_client_id);


--
-- TOC entry 3773 (class 1259 OID 17093)
-- Name: idx_fu_consent; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_fu_consent ON public.fed_user_consent USING btree (user_id, client_id);


--
-- TOC entry 3774 (class 1259 OID 17094)
-- Name: idx_fu_consent_ru; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_fu_consent_ru ON public.fed_user_consent USING btree (realm_id, user_id);


--
-- TOC entry 3779 (class 1259 OID 17095)
-- Name: idx_fu_credential; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_fu_credential ON public.fed_user_credential USING btree (user_id, type);


--
-- TOC entry 3780 (class 1259 OID 17096)
-- Name: idx_fu_credential_ru; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_fu_credential_ru ON public.fed_user_credential USING btree (realm_id, user_id);


--
-- TOC entry 3783 (class 1259 OID 17097)
-- Name: idx_fu_group_membership; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_fu_group_membership ON public.fed_user_group_membership USING btree (user_id, group_id);


--
-- TOC entry 3784 (class 1259 OID 17098)
-- Name: idx_fu_group_membership_ru; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_fu_group_membership_ru ON public.fed_user_group_membership USING btree (realm_id, user_id);


--
-- TOC entry 3787 (class 1259 OID 17099)
-- Name: idx_fu_required_action; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_fu_required_action ON public.fed_user_required_action USING btree (user_id, required_action);


--
-- TOC entry 3788 (class 1259 OID 17100)
-- Name: idx_fu_required_action_ru; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_fu_required_action_ru ON public.fed_user_required_action USING btree (realm_id, user_id);


--
-- TOC entry 3791 (class 1259 OID 17101)
-- Name: idx_fu_role_mapping; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_fu_role_mapping ON public.fed_user_role_mapping USING btree (user_id, role_id);


--
-- TOC entry 3792 (class 1259 OID 17102)
-- Name: idx_fu_role_mapping_ru; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_fu_role_mapping_ru ON public.fed_user_role_mapping USING btree (realm_id, user_id);


--
-- TOC entry 3801 (class 1259 OID 17103)
-- Name: idx_group_att_by_name_value; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_group_att_by_name_value ON public.group_attribute USING btree (name, ((value)::character varying(250)));


--
-- TOC entry 3802 (class 1259 OID 17104)
-- Name: idx_group_attr_group; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_group_attr_group ON public.group_attribute USING btree (group_id);


--
-- TOC entry 3805 (class 1259 OID 17105)
-- Name: idx_group_role_mapp_group; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_group_role_mapp_group ON public.group_role_mapping USING btree (group_id);


--
-- TOC entry 3817 (class 1259 OID 17106)
-- Name: idx_id_prov_mapp_realm; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_id_prov_mapp_realm ON public.identity_provider_mapper USING btree (realm_id);


--
-- TOC entry 3808 (class 1259 OID 17107)
-- Name: idx_ident_prov_realm; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_ident_prov_realm ON public.identity_provider USING btree (realm_id);


--
-- TOC entry 3809 (class 1259 OID 17108)
-- Name: idx_idp_for_login; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_idp_for_login ON public.identity_provider USING btree (realm_id, enabled, link_only, hide_on_login, organization_id);


--
-- TOC entry 3810 (class 1259 OID 17109)
-- Name: idx_idp_realm_org; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_idp_realm_org ON public.identity_provider USING btree (realm_id, organization_id);


--
-- TOC entry 3830 (class 1259 OID 17110)
-- Name: idx_keycloak_role_client; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_keycloak_role_client ON public.keycloak_role USING btree (client);


--
-- TOC entry 3831 (class 1259 OID 17111)
-- Name: idx_keycloak_role_realm; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_keycloak_role_realm ON public.keycloak_role USING btree (realm);


--
-- TOC entry 3843 (class 1259 OID 17112)
-- Name: idx_offline_uss_by_broker_session_id; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_offline_uss_by_broker_session_id ON public.offline_user_session USING btree (broker_session_id, realm_id);


--
-- TOC entry 3844 (class 1259 OID 17113)
-- Name: idx_offline_uss_by_last_session_refresh; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_offline_uss_by_last_session_refresh ON public.offline_user_session USING btree (realm_id, offline_flag, last_session_refresh);


--
-- TOC entry 3845 (class 1259 OID 17114)
-- Name: idx_offline_uss_by_user; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_offline_uss_by_user ON public.offline_user_session USING btree (user_id, realm_id, offline_flag);


--
-- TOC entry 3856 (class 1259 OID 17115)
-- Name: idx_org_domain_org_id; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_org_domain_org_id ON public.org_domain USING btree (org_id);


--
-- TOC entry 3913 (class 1259 OID 17116)
-- Name: idx_perm_ticket_owner; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_perm_ticket_owner ON public.resource_server_perm_ticket USING btree (owner);


--
-- TOC entry 3914 (class 1259 OID 17117)
-- Name: idx_perm_ticket_requester; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_perm_ticket_requester ON public.resource_server_perm_ticket USING btree (requester);


--
-- TOC entry 3862 (class 1259 OID 17118)
-- Name: idx_protocol_mapper_client; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_protocol_mapper_client ON public.protocol_mapper USING btree (client_id);


--
-- TOC entry 3872 (class 1259 OID 17119)
-- Name: idx_realm_attr_realm; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_realm_attr_realm ON public.realm_attribute USING btree (realm_id);


--
-- TOC entry 3725 (class 1259 OID 17120)
-- Name: idx_realm_clscope; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_realm_clscope ON public.client_scope USING btree (realm_id);


--
-- TOC entry 3877 (class 1259 OID 17121)
-- Name: idx_realm_def_grp_realm; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_realm_def_grp_realm ON public.realm_default_groups USING btree (realm_id);


--
-- TOC entry 3883 (class 1259 OID 17122)
-- Name: idx_realm_evt_list_realm; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_realm_evt_list_realm ON public.realm_events_listeners USING btree (realm_id);


--
-- TOC entry 3880 (class 1259 OID 17123)
-- Name: idx_realm_evt_types_realm; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_realm_evt_types_realm ON public.realm_enabled_event_types USING btree (realm_id);


--
-- TOC entry 3867 (class 1259 OID 17124)
-- Name: idx_realm_master_adm_cli; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_realm_master_adm_cli ON public.realm USING btree (master_admin_client);


--
-- TOC entry 3892 (class 1259 OID 17125)
-- Name: idx_realm_supp_local_realm; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_realm_supp_local_realm ON public.realm_supported_locales USING btree (realm_id);


--
-- TOC entry 3895 (class 1259 OID 17126)
-- Name: idx_redir_uri_client; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_redir_uri_client ON public.redirect_uris USING btree (client_id);


--
-- TOC entry 3900 (class 1259 OID 17127)
-- Name: idx_req_act_prov_realm; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_req_act_prov_realm ON public.required_action_provider USING btree (realm_id);


--
-- TOC entry 3905 (class 1259 OID 17128)
-- Name: idx_res_policy_policy; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_res_policy_policy ON public.resource_policy USING btree (policy_id);


--
-- TOC entry 3908 (class 1259 OID 17129)
-- Name: idx_res_scope_scope; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_res_scope_scope ON public.resource_scope USING btree (scope_id);


--
-- TOC entry 3919 (class 1259 OID 17130)
-- Name: idx_res_serv_pol_res_serv; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_res_serv_pol_res_serv ON public.resource_server_policy USING btree (resource_server_id);


--
-- TOC entry 3924 (class 1259 OID 17131)
-- Name: idx_res_srv_res_res_srv; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_res_srv_res_res_srv ON public.resource_server_resource USING btree (resource_server_id);


--
-- TOC entry 3929 (class 1259 OID 17132)
-- Name: idx_res_srv_scope_res_srv; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_res_srv_scope_res_srv ON public.resource_server_scope USING btree (resource_server_id);


--
-- TOC entry 3936 (class 1259 OID 17133)
-- Name: idx_rev_token_on_expire; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_rev_token_on_expire ON public.revoked_token USING btree (expire);


--
-- TOC entry 3939 (class 1259 OID 17134)
-- Name: idx_role_attribute; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_role_attribute ON public.role_attribute USING btree (role_id);


--
-- TOC entry 3738 (class 1259 OID 17135)
-- Name: idx_role_clscope; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_role_clscope ON public.client_scope_role_mapping USING btree (role_id);


--
-- TOC entry 3942 (class 1259 OID 17136)
-- Name: idx_scope_mapping_role; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_scope_mapping_role ON public.scope_mapping USING btree (role_id);


--
-- TOC entry 3945 (class 1259 OID 17137)
-- Name: idx_scope_policy_policy; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_scope_policy_policy ON public.scope_policy USING btree (policy_id);


--
-- TOC entry 3834 (class 1259 OID 17138)
-- Name: idx_update_time; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_update_time ON public.migration_model USING btree (update_time);


--
-- TOC entry 3963 (class 1259 OID 17139)
-- Name: idx_usconsent_clscope; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_usconsent_clscope ON public.user_consent_client_scope USING btree (user_consent_id);


--
-- TOC entry 3964 (class 1259 OID 17140)
-- Name: idx_usconsent_scope_id; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_usconsent_scope_id ON public.user_consent_client_scope USING btree (scope_id);


--
-- TOC entry 3950 (class 1259 OID 17141)
-- Name: idx_user_attribute; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_user_attribute ON public.user_attribute USING btree (user_id);


--
-- TOC entry 3951 (class 1259 OID 17142)
-- Name: idx_user_attribute_name; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_user_attribute_name ON public.user_attribute USING btree (name, value);


--
-- TOC entry 3956 (class 1259 OID 17143)
-- Name: idx_user_consent; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_user_consent ON public.user_consent USING btree (user_id);


--
-- TOC entry 3754 (class 1259 OID 17144)
-- Name: idx_user_credential; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_user_credential ON public.credential USING btree (user_id);


--
-- TOC entry 3967 (class 1259 OID 17145)
-- Name: idx_user_email; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_user_email ON public.user_entity USING btree (email);


--
-- TOC entry 3986 (class 1259 OID 17146)
-- Name: idx_user_group_mapping; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_user_group_mapping ON public.user_group_membership USING btree (user_id);


--
-- TOC entry 3989 (class 1259 OID 17147)
-- Name: idx_user_reqactions; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_user_reqactions ON public.user_required_action USING btree (user_id);


--
-- TOC entry 3992 (class 1259 OID 17148)
-- Name: idx_user_role_mapping; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_user_role_mapping ON public.user_role_mapping USING btree (user_id);


--
-- TOC entry 3968 (class 1259 OID 17149)
-- Name: idx_user_service_account; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_user_service_account ON public.user_entity USING btree (realm_id, service_account_client_link);


--
-- TOC entry 3977 (class 1259 OID 17150)
-- Name: idx_usr_fed_map_fed_prv; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_usr_fed_map_fed_prv ON public.user_federation_mapper USING btree (federation_provider_id);


--
-- TOC entry 3978 (class 1259 OID 17151)
-- Name: idx_usr_fed_map_realm; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_usr_fed_map_realm ON public.user_federation_mapper USING btree (realm_id);


--
-- TOC entry 3983 (class 1259 OID 17152)
-- Name: idx_usr_fed_prv_realm; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_usr_fed_prv_realm ON public.user_federation_provider USING btree (realm_id);


--
-- TOC entry 3995 (class 1259 OID 17153)
-- Name: idx_web_orig_client; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_web_orig_client ON public.web_origins USING btree (client_id);


--
-- TOC entry 3996 (class 1259 OID 17154)
-- Name: idx_workflow_state_provider; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_workflow_state_provider ON public.workflow_state USING btree (resource_id, workflow_provider_id);


--
-- TOC entry 3997 (class 1259 OID 17155)
-- Name: idx_workflow_state_step; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX idx_workflow_state_step ON public.workflow_state USING btree (workflow_id, scheduled_step_id);


--
-- TOC entry 3952 (class 1259 OID 17156)
-- Name: user_attr_long_values; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX user_attr_long_values ON public.user_attribute USING btree (long_value_hash, name);


--
-- TOC entry 3953 (class 1259 OID 17157)
-- Name: user_attr_long_values_lower_case; Type: INDEX; Schema: public; Owner: kc_user
--

CREATE INDEX user_attr_long_values_lower_case ON public.user_attribute USING btree (long_value_hash_lower_case, name);


--
-- TOC entry 4022 (class 2606 OID 17158)
-- Name: identity_provider fk2b4ebc52ae5c3b34; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT fk2b4ebc52ae5c3b34 FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4008 (class 2606 OID 17163)
-- Name: client_attributes fk3c47c64beacca966; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.client_attributes
    ADD CONSTRAINT fk3c47c64beacca966 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- TOC entry 4019 (class 2606 OID 17168)
-- Name: federated_identity fk404288b92ef007a6; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.federated_identity
    ADD CONSTRAINT fk404288b92ef007a6 FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- TOC entry 4010 (class 2606 OID 17173)
-- Name: client_node_registrations fk4129723ba992f594; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.client_node_registrations
    ADD CONSTRAINT fk4129723ba992f594 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- TOC entry 4038 (class 2606 OID 17178)
-- Name: redirect_uris fk_1burs8pb4ouj97h5wuppahv9f; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.redirect_uris
    ADD CONSTRAINT fk_1burs8pb4ouj97h5wuppahv9f FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- TOC entry 4064 (class 2606 OID 17183)
-- Name: user_federation_provider fk_1fj32f6ptolw2qy60cd8n01e8; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_federation_provider
    ADD CONSTRAINT fk_1fj32f6ptolw2qy60cd8n01e8 FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4035 (class 2606 OID 17188)
-- Name: realm_required_credential fk_5hg65lybevavkqfki3kponh9v; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.realm_required_credential
    ADD CONSTRAINT fk_5hg65lybevavkqfki3kponh9v FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4040 (class 2606 OID 17193)
-- Name: resource_attribute fk_5hrm2vlf9ql5fu022kqepovbr; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_attribute
    ADD CONSTRAINT fk_5hrm2vlf9ql5fu022kqepovbr FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- TOC entry 4057 (class 2606 OID 17198)
-- Name: user_attribute fk_5hrm2vlf9ql5fu043kqepovbr; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_attribute
    ADD CONSTRAINT fk_5hrm2vlf9ql5fu043kqepovbr FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- TOC entry 4066 (class 2606 OID 17203)
-- Name: user_required_action fk_6qj3w1jw9cvafhe19bwsiuvmd; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_required_action
    ADD CONSTRAINT fk_6qj3w1jw9cvafhe19bwsiuvmd FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- TOC entry 4026 (class 2606 OID 17208)
-- Name: keycloak_role fk_6vyqfe4cn4wlq8r6kt5vdsj5c; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT fk_6vyqfe4cn4wlq8r6kt5vdsj5c FOREIGN KEY (realm) REFERENCES public.realm(id);


--
-- TOC entry 4036 (class 2606 OID 17213)
-- Name: realm_smtp_config fk_70ej8xdxgxd0b9hh6180irr0o; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.realm_smtp_config
    ADD CONSTRAINT fk_70ej8xdxgxd0b9hh6180irr0o FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4031 (class 2606 OID 17218)
-- Name: realm_attribute fk_8shxd6l3e9atqukacxgpffptw; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.realm_attribute
    ADD CONSTRAINT fk_8shxd6l3e9atqukacxgpffptw FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4015 (class 2606 OID 17223)
-- Name: composite_role fk_a63wvekftu8jo1pnj81e7mce2; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT fk_a63wvekftu8jo1pnj81e7mce2 FOREIGN KEY (composite) REFERENCES public.keycloak_role(id);


--
-- TOC entry 4004 (class 2606 OID 17228)
-- Name: authentication_execution fk_auth_exec_flow; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT fk_auth_exec_flow FOREIGN KEY (flow_id) REFERENCES public.authentication_flow(id);


--
-- TOC entry 4005 (class 2606 OID 17233)
-- Name: authentication_execution fk_auth_exec_realm; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT fk_auth_exec_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4006 (class 2606 OID 17238)
-- Name: authentication_flow fk_auth_flow_realm; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.authentication_flow
    ADD CONSTRAINT fk_auth_flow_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4007 (class 2606 OID 17243)
-- Name: authenticator_config fk_auth_realm; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.authenticator_config
    ADD CONSTRAINT fk_auth_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4067 (class 2606 OID 17248)
-- Name: user_role_mapping fk_c4fqv34p1mbylloxang7b1q3l; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_role_mapping
    ADD CONSTRAINT fk_c4fqv34p1mbylloxang7b1q3l FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- TOC entry 4011 (class 2606 OID 17253)
-- Name: client_scope_attributes fk_cl_scope_attr_scope; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.client_scope_attributes
    ADD CONSTRAINT fk_cl_scope_attr_scope FOREIGN KEY (scope_id) REFERENCES public.client_scope(id);


--
-- TOC entry 4012 (class 2606 OID 17258)
-- Name: client_scope_role_mapping fk_cl_scope_rm_scope; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.client_scope_role_mapping
    ADD CONSTRAINT fk_cl_scope_rm_scope FOREIGN KEY (scope_id) REFERENCES public.client_scope(id);


--
-- TOC entry 4028 (class 2606 OID 17263)
-- Name: protocol_mapper fk_cli_scope_mapper; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT fk_cli_scope_mapper FOREIGN KEY (client_scope_id) REFERENCES public.client_scope(id);


--
-- TOC entry 4009 (class 2606 OID 17268)
-- Name: client_initial_access fk_client_init_acc_realm; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.client_initial_access
    ADD CONSTRAINT fk_client_init_acc_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4014 (class 2606 OID 17273)
-- Name: component_config fk_component_config; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.component_config
    ADD CONSTRAINT fk_component_config FOREIGN KEY (component_id) REFERENCES public.component(id);


--
-- TOC entry 4013 (class 2606 OID 17278)
-- Name: component fk_component_realm; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.component
    ADD CONSTRAINT fk_component_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4032 (class 2606 OID 17283)
-- Name: realm_default_groups fk_def_groups_realm; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT fk_def_groups_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4063 (class 2606 OID 17288)
-- Name: user_federation_mapper_config fk_fedmapper_cfg; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_federation_mapper_config
    ADD CONSTRAINT fk_fedmapper_cfg FOREIGN KEY (user_federation_mapper_id) REFERENCES public.user_federation_mapper(id);


--
-- TOC entry 4061 (class 2606 OID 17293)
-- Name: user_federation_mapper fk_fedmapperpm_fedprv; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT fk_fedmapperpm_fedprv FOREIGN KEY (federation_provider_id) REFERENCES public.user_federation_provider(id);


--
-- TOC entry 4062 (class 2606 OID 17298)
-- Name: user_federation_mapper fk_fedmapperpm_realm; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT fk_fedmapperpm_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4002 (class 2606 OID 17303)
-- Name: associated_policy fk_frsr5s213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT fk_frsr5s213xcx4wnkog82ssrfy FOREIGN KEY (associated_policy_id) REFERENCES public.resource_server_policy(id);


--
-- TOC entry 4055 (class 2606 OID 17308)
-- Name: scope_policy fk_frsrasp13xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT fk_frsrasp13xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- TOC entry 4045 (class 2606 OID 17313)
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog82sspmt; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog82sspmt FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- TOC entry 4050 (class 2606 OID 17318)
-- Name: resource_server_resource fk_frsrho213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT fk_frsrho213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- TOC entry 4046 (class 2606 OID 17323)
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog83sspmt; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog83sspmt FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- TOC entry 4047 (class 2606 OID 17328)
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog84sspmt; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog84sspmt FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- TOC entry 4003 (class 2606 OID 17333)
-- Name: associated_policy fk_frsrpas14xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT fk_frsrpas14xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- TOC entry 4056 (class 2606 OID 17338)
-- Name: scope_policy fk_frsrpass3xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT fk_frsrpass3xcx4wnkog82ssrfy FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- TOC entry 4048 (class 2606 OID 17343)
-- Name: resource_server_perm_ticket fk_frsrpo2128cx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrpo2128cx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- TOC entry 4049 (class 2606 OID 17348)
-- Name: resource_server_policy fk_frsrpo213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT fk_frsrpo213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- TOC entry 4043 (class 2606 OID 17353)
-- Name: resource_scope fk_frsrpos13xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT fk_frsrpos13xcx4wnkog82ssrfy FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- TOC entry 4041 (class 2606 OID 17358)
-- Name: resource_policy fk_frsrpos53xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT fk_frsrpos53xcx4wnkog82ssrfy FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- TOC entry 4042 (class 2606 OID 17363)
-- Name: resource_policy fk_frsrpp213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT fk_frsrpp213xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- TOC entry 4044 (class 2606 OID 17368)
-- Name: resource_scope fk_frsrps213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT fk_frsrps213xcx4wnkog82ssrfy FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- TOC entry 4051 (class 2606 OID 17373)
-- Name: resource_server_scope fk_frsrso213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT fk_frsrso213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- TOC entry 4016 (class 2606 OID 17378)
-- Name: composite_role fk_gr7thllb9lu8q4vqa4524jjy8; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT fk_gr7thllb9lu8q4vqa4524jjy8 FOREIGN KEY (child_role) REFERENCES public.keycloak_role(id);


--
-- TOC entry 4059 (class 2606 OID 17383)
-- Name: user_consent_client_scope fk_grntcsnt_clsc_usc; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_consent_client_scope
    ADD CONSTRAINT fk_grntcsnt_clsc_usc FOREIGN KEY (user_consent_id) REFERENCES public.user_consent(id);


--
-- TOC entry 4058 (class 2606 OID 17388)
-- Name: user_consent fk_grntcsnt_user; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT fk_grntcsnt_user FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- TOC entry 4020 (class 2606 OID 17393)
-- Name: group_attribute fk_group_attribute_group; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.group_attribute
    ADD CONSTRAINT fk_group_attribute_group FOREIGN KEY (group_id) REFERENCES public.keycloak_group(id);


--
-- TOC entry 4021 (class 2606 OID 17398)
-- Name: group_role_mapping fk_group_role_group; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.group_role_mapping
    ADD CONSTRAINT fk_group_role_group FOREIGN KEY (group_id) REFERENCES public.keycloak_group(id);


--
-- TOC entry 4033 (class 2606 OID 17403)
-- Name: realm_enabled_event_types fk_h846o4h0w8epx5nwedrf5y69j; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.realm_enabled_event_types
    ADD CONSTRAINT fk_h846o4h0w8epx5nwedrf5y69j FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4034 (class 2606 OID 17408)
-- Name: realm_events_listeners fk_h846o4h0w8epx5nxev9f5y69j; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.realm_events_listeners
    ADD CONSTRAINT fk_h846o4h0w8epx5nxev9f5y69j FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4024 (class 2606 OID 17413)
-- Name: identity_provider_mapper fk_idpm_realm; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.identity_provider_mapper
    ADD CONSTRAINT fk_idpm_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4025 (class 2606 OID 17418)
-- Name: idp_mapper_config fk_idpmconfig; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.idp_mapper_config
    ADD CONSTRAINT fk_idpmconfig FOREIGN KEY (idp_mapper_id) REFERENCES public.identity_provider_mapper(id);


--
-- TOC entry 4068 (class 2606 OID 17423)
-- Name: web_origins fk_lojpho213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.web_origins
    ADD CONSTRAINT fk_lojpho213xcx4wnkog82ssrfy FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- TOC entry 4054 (class 2606 OID 17428)
-- Name: scope_mapping fk_ouse064plmlr732lxjcn1q5f1; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.scope_mapping
    ADD CONSTRAINT fk_ouse064plmlr732lxjcn1q5f1 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- TOC entry 4029 (class 2606 OID 17433)
-- Name: protocol_mapper fk_pcm_realm; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT fk_pcm_realm FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- TOC entry 4017 (class 2606 OID 17438)
-- Name: credential fk_pfyr0glasqyl0dei3kl69r6v0; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.credential
    ADD CONSTRAINT fk_pfyr0glasqyl0dei3kl69r6v0 FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- TOC entry 4030 (class 2606 OID 17443)
-- Name: protocol_mapper_config fk_pmconfig; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.protocol_mapper_config
    ADD CONSTRAINT fk_pmconfig FOREIGN KEY (protocol_mapper_id) REFERENCES public.protocol_mapper(id);


--
-- TOC entry 4018 (class 2606 OID 17448)
-- Name: default_client_scope fk_r_def_cli_scope_realm; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.default_client_scope
    ADD CONSTRAINT fk_r_def_cli_scope_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4039 (class 2606 OID 17453)
-- Name: required_action_provider fk_req_act_realm; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.required_action_provider
    ADD CONSTRAINT fk_req_act_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4052 (class 2606 OID 17458)
-- Name: resource_uris fk_resource_server_uris; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.resource_uris
    ADD CONSTRAINT fk_resource_server_uris FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- TOC entry 4053 (class 2606 OID 17463)
-- Name: role_attribute fk_role_attribute_id; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.role_attribute
    ADD CONSTRAINT fk_role_attribute_id FOREIGN KEY (role_id) REFERENCES public.keycloak_role(id);


--
-- TOC entry 4037 (class 2606 OID 17468)
-- Name: realm_supported_locales fk_supported_locales_realm; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.realm_supported_locales
    ADD CONSTRAINT fk_supported_locales_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4060 (class 2606 OID 17473)
-- Name: user_federation_config fk_t13hpu1j94r2ebpekr39x5eu5; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_federation_config
    ADD CONSTRAINT fk_t13hpu1j94r2ebpekr39x5eu5 FOREIGN KEY (user_federation_provider_id) REFERENCES public.user_federation_provider(id);


--
-- TOC entry 4065 (class 2606 OID 17478)
-- Name: user_group_membership fk_user_group_user; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.user_group_membership
    ADD CONSTRAINT fk_user_group_user FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- TOC entry 4027 (class 2606 OID 17483)
-- Name: policy_config fkdc34197cf864c4e43; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.policy_config
    ADD CONSTRAINT fkdc34197cf864c4e43 FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- TOC entry 4023 (class 2606 OID 17488)
-- Name: identity_provider_config fkdc4897cf864c4e43; Type: FK CONSTRAINT; Schema: public; Owner: kc_user
--

ALTER TABLE ONLY public.identity_provider_config
    ADD CONSTRAINT fkdc4897cf864c4e43 FOREIGN KEY (identity_provider_id) REFERENCES public.identity_provider(internal_id);


-- Completed on 2025-10-18 10:29:07 -03

--
-- PostgreSQL database dump complete
--

