---
title: Survey
date: 2016-11-30 12:57:00 -06:00
permalink: "/contact/survey/"
position: 0
show_in_nav: false
title_md: "# Let's kick things off."
content_md: |-
  We appreciate your interest in working with Concentric Design.
  {: .bigger .text-center }
  \\
  Please take a few minutes to complete our short survey to help us understand what you'd like to accomplish together.
  {: .bigger .text-center }
submit_button_label: Submit
form_error_label: Fix Errors
form_sections:
- title: You
  fields:
  - unique_name: name
    type: text
    required: true
    label: 'Your name:'
    placeholder: John Smith
  - unique_name: email
    type: email
    required: true
    label: 'Your e-mail:'
    placeholder: myemail@domain.com
  - unique_name: phone
    type: text
    required: true
    label: 'Phone:'
    placeholder: "(•••) ••• ••••"
- title: Your organization
  fields:
  - unique_name: biz_name
    type: text
    required: true
    label: 'Your organization''s name:'
    placeholder: My Business Name
  - unique_name: biz_url
    type: url
    required: false
    label: 'Your organization''s website:'
    placeholder: my-biz.com
  - type: checkbox_group
    group_title: 'Check the box(es) that describe your business:'
    checkboxes:
    - unique_name: biz_detail_startup
      label: Startup
    - unique_name: biz_detail_small
      label: Small business (< 50 people)
    - unique_name: biz_detail_medium
      label: Medium (50-100)
    - unique_name: biz_detail_large
      label: Large (100+)
    - unique_name: biz_detail_xl
      label: Extra large (thousands)
    - unique_name: biz_detail_non-profit
      label: Non-profit/education
    - unique_name: biz_detail_product
      label: Product-based
    - unique_name: biz_detail_service
      label: Service-based
  - unique_name: biz_description
    type: textarea
    required: false
    label: 'Briefly describe your organization''s product or service:'
    placeholder: Enter description here
- title: Your project
  fields:
  - type: checkbox_group
    group_title: What service(s) do you need?
    checkboxes:
    - unique_name: project_service_identity
      label: Identity (logo, branding, strategy)
    - unique_name: project_service_digital
      label: Digital (website, app, media)
    - unique_name: project_service_print
      label: Print (collateral, signage)
    - unique_name: project_service_unknown
      label: I don’t know
  - unique_name: start_date
    type: text
    required: false
    label: When are you ready to start?
    placeholder: Start date, or approximate
  - unique_name: completion_date
    type: text
    required: false
    label: When do you need the project completed/launched?
    placeholder: Completion date, or approximate
  - unique_name: project_needs
    type: textarea
    required: false
    label: 'Briefly describe your project needs:'
    placeholder: Enter description here
  - unique_name: completion_date
    type: text
    required: false
    label: What is your budget for this project?
    placeholder: Dollar amount, or approximate
layout: survey
---

