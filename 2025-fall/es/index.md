---
layout: default
title: Diseño Web 2025 · Otoño
lang: es
term: 2025-fall
---

# {{ page.title }}

**Universidad:** {{ site.data.courses[page.term].es.university }}  
**Profesor:** Rubén Vega Balbás, PhD  
**Metodología:** _Critical Coding for a Better Living_

## Bienvenida

Este es el sitio del curso de **{{ site.data.courses[page.term].es.course_name }}** para el semestre {{ site.data.courses[page.term].es.term }}. Aquí encontrarás:

- Enlaces a las lecciones canónicas
- El showroom de proyectos estudiantiles
- Calendario y entregas importantes

## Lecciones

Las lecciones canónicas se encuentran en [Web Foundations]({{ site.data.courses[page.term].es.canonical_lessons_base }}).

{% comment %} Auto-generated from \_data/lessons/{{ page.term }}/es.yml {% endcomment %}
{% assign lessons = site.data.lessons[page.term].es %}
{% assign canon = site.data.courses[page.term].es.canonical_lessons_base %}
{% if lessons %}
{% for l in lessons %}

- [{{ l.title }}]({{ canon }}{{ l.path }})
  {% endfor %}
  {% else %}
- Lessons coming soon.
  {% endif %}

## Proyectos Estudiantiles

{% comment %} Student showroom will be generated here {% endcomment %}
{% include students-list-by-files.html lang='es' term='2025-fall' %}

## Entregas Importantes

- **Semana 2:** Brief de proyecto
- **Semana 4:** Metadatos del proyecto
- **Semana 5:** Lanzamiento del showroom
- **Semana 12:** Presentación final

## Recursos

- [Metodología ATELIER](https://ruvebal.github.io/web-atelier-udit/methodology/es/)
- [Plantillas y Ejemplos](https://github.com/ruvebal/web-atelier-udit)
- [GitHub Classroom](https://classroom.github.com/) (enlace específico por confirmar)
