PGDMP     /    7                z         
   backoffice    14.3    14.3     #           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            $           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            %           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            &           1262    16433 
   backoffice    DATABASE     n   CREATE DATABASE backoffice WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'English_United States.1252';
    DROP DATABASE backoffice;
                postgres    false            �            1259    33624    reply    TABLE     �   CREATE TABLE public.reply (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    userid character varying(255) NOT NULL,
    review text,
    "time" timestamp without time zone
);
    DROP TABLE public.reply;
       public         heap    postgres    false                       0    33624    reply 
   TABLE DATA           C   COPY public.reply (id, author, userid, review, "time") FROM stdin;
    public          postgres    false    227   �       �           2606    33632    reply appreciationreply_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.reply
    ADD CONSTRAINT appreciationreply_pkey PRIMARY KEY (id, author, userid);
 F   ALTER TABLE ONLY public.reply DROP CONSTRAINT appreciationreply_pkey;
       public            postgres    false    227    227    227                q   x���;�0k�)�@�����e�8 J6N�H@��A)i�L5� v���#���J��,�)�)W��̶v�����w'P�.-��P%��ĩ�o�W_�6I_�����/-�     