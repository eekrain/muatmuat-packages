# UI Language Translation Guide

## Overview

This document outlines the systematic process for converting UI elements from Figma/designs into structured language translations supporting multiple languages (ID, EN, CN).

## Input Requirements

### Required Materials

1. UI Screenshots or Figma designs
2. Clear indication of all text elements:
   - Modal/popup windows
   - Button texts
   - Tooltips and messages
   - Form labels
   - Success/error states

### Output Structure

The translations should be formatted in tab-separated columns:

```
[Class]  [Form]  [Value ID]  [Value EN]  [Label]  [Value CN]
```

## Standard Prompt Template

```
Please convert these UI elements into language translations following this structure:

1. Class: [specific class name]
   - Usually lowercase
   - No spaces
   - Example: jadwaloperasional

2. Form: [form identifier]
   - Usually camelCase
   - Example: operationalSchedule

3. Value ID: Original Indonesian text
   - Keep original formatting
   - Don't modify original text

4. Value EN: English translation
   - Natural English phrasing
   - Maintain original context

5. Label: [typeOfElement][Purpose]
   - Use camelCase
   - Example: buttonSave, titleNotification

6. Value CN: Chinese translation
   - Maintain context and meaning
   - Use appropriate formal tone
```

## Rules and Guidelines

### Label Naming Rules

1. Must be unique within the same class
2. Use camelCase format
3. Start with component type:
   - button
   - title
   - desc
   - label
   - tooltip
4. Follow with specific purpose
   - Example: buttonSave, titleNotification

### Content Guidelines

1. No duplicate Indonesian values
2. Include all states:
   - Success messages
   - Error messages
   - Confirmation dialogs
3. Capture all modal/popup text
4. Include all tooltips and helper text
5. Group related translations together

## Element Type Reference

| Type    | Usage                 | Example Label         |
| ------- | --------------------- | --------------------- |
| title   | Page/section headers  | titleOperationalHours |
| button  | Clickable actions     | buttonSave            |
| desc    | Descriptive text      | descNotification      |
| label   | Form labels           | labelDay              |
| tooltip | Hover/help text       | tooltipSchedule       |
| message | Success/error notices | messageSuccess        |

## Example Implementation

```
jadwaloperasional  operationalSchedule  Simpan  Save  buttonSave  保存
jadwaloperasional  operationalSchedule  Batal  Cancel  buttonCancel  取消
jadwaloperasional  operationalSchedule  Pemberitahuan  Notification  titleNotification  通知
```

## Best Practices

1. **Grouping**

   - Keep related translations together
   - Group by functional area or modal

2. **Consistency**

   - Maintain consistent label naming
   - Use same terms for similar actions

3. **Completeness**

   - Capture all UI states
   - Include all contextual elements

4. **Context Preservation**

   - Maintain original meaning
   - Consider cultural appropriateness

5. **Validation**
   - Check for duplicate values
   - Verify label uniqueness
   - Ensure proper formatting

## Common Pitfalls to Avoid

1. Duplicate Indonesian values
2. Inconsistent label naming
3. Missing UI states
4. Incorrect camelCase format
5. Non-unique labels
6. Missing contextual elements

## Quality Checklist

- [ ] All text elements captured
- [ ] Labels are unique
- [ ] Proper camelCase format used
- [ ] No duplicate Indonesian values
- [ ] All states included
- [ ] Grouped logically
- [ ] Contextually accurate translations
- [ ] Tab-separated format verified

## Tools and Resources

1. Excel for final formatting
2. Text editor for initial drafting
3. Translation verification tools
4. Language style guides

## Maintenance

1. Regular reviews for consistency
2. Update documentation as needed
3. Track changes and versions
4. Maintain master translation file

---

_Note: This document should be updated as new requirements or best practices emerge._
