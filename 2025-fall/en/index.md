---
layout: default
title: ADVANCED WEB DESIGN — 2025 · Fall
lang: en
term: 2025-fall
---

# {{ page.title }}

**University:** {{ site.data.courses[page.term].en.university }}  
**Professor:** Rubén Vega Balbás, PhD  
**Methodology:** _Critical Coding for a Better Living_

## Welcome

This is the course site for **{{ site.data.courses[page.term].en.course_name }}** for {{ site.data.courses[page.term].en.term }}. Here you'll find:

- Links to canonical lessons
- Student project showroom
- Schedule and important deliverables

## Lessons

Canonical lessons are located in [Web Foundations]({{ site.data.courses[page.term].en.canonical_lessons_base }}).

{% comment %} Auto-generated from \_data/lessons/{{ page.term }}/en.yml {% endcomment %}
{% assign lessons = site.data.lessons[page.term].en %}
{% assign canon = site.data.courses[page.term].en.canonical_lessons_base %}
{% if lessons %}
{% for l in lessons %}

- [{{ l.title }}]({{ canon }}{{ l.path }})
  {% endfor %}
  {% else %}
- Lessons coming soon.
  {% endif %}

## Student Projects

{% comment %} Student showroom will be generated here {% endcomment %}
{% include students-list-by-files.html lang='en' term='2025-fall' %}

## Important Deliverables

- **Week 2:** Project brief
- **Week 4:** Project metadata
- **Week 5:** Showroom launch
- **Week 12:** Final presentation

## Resources

- [ATELIER Methodology](https://ruvebal.github.io/web-atelier-udit/methodology/en/)
- [Templates & Examples](https://github.com/ruvebal/web-atelier-udit)
- [GitHub Classroom](https://classroom.github.com/) (specific link TBD)


