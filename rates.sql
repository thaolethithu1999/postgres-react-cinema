PGDMP         :                z         
   backoffice    14.3    14.3     %           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            &           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            '           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            (           1262    16433 
   backoffice    DATABASE     n   CREATE DATABASE backoffice WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'English_United States.1252';
    DROP DATABASE backoffice;
                postgres    false            ?            1259    32960    rates    TABLE       CREATE TABLE public.rates (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    rate integer,
    "time" timestamp without time zone,
    review text,
    usefulcount integer DEFAULT 0,
    replycount integer DEFAULT 0
);
    DROP TABLE public.rates;
       public         heap    postgres    false            "          0    32960    rates 
   TABLE DATA           Z   COPY public.rates (id, author, rate, "time", review, usefulcount, replycount) FROM stdin;
    public          postgres    false    223   ?       ?           2606    32966    rates rates_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.rates
    ADD CONSTRAINT rates_pkey PRIMARY KEY (id, author);
 :   ALTER TABLE ONLY public.rates DROP CONSTRAINT rates_pkey;
       public            postgres    false    223    223            "   u   x?E?1?0F??9E/???7MFPq $??&`a??T,]??> `:/??tZ_?$?G???b????L?ϛ@??rv5?y??ަ?)+n?o?6?t@60W?j%??G{?;?n]b?r??     