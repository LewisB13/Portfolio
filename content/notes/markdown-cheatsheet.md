---
title: Markdown Cheatsheet
date: 2026-06-03T04:17:00
category: Other
tags: []
visibility: ''
---

## Headings

```plain
# H1
## H2
### H3
#### H4
```

# H1

## H2

### H3

#### H4

***

## Text Formatting

```plain
**bold**
*italic*
***bold italic***
~~strikethrough~~
`inline code`
```

**bold**
_italic_
**_bold italic_**
strikethrough
`inline code`

***

## Lists

### Bullet List

```plain
- Item 1
- Item 2
  - Nested item
```

- Item 1
- Item 2
    - Nested item

### Numbered List

```plain
1. First
2. Second
3. Third
```

1. First
2. Second
3. Third

### Task List

```plain
- [x] Done
- [ ] Todo
```

- [x] Done
- [ ] Todo

***

## Links

```plain
[OpenAI](https://openai.com)
```

[OpenAI](https://openai.com)

***

## Images

```plain
![Alt text](image.png)
```

***

## Blockquotes

```plain
> This is a quote
>> Nested quote
```

> This is a quoteNested quote

***

## Code Blocks

### Fenced Code Block

<pre> \`\`\`python print("Hello world") \`\`\` </pre>

```plain
print("Hello world")
```

***

## Tables

```plain
| Name | Age |
|------|-----|
| Alice | 25 |
| Bob | 30 |
```

| Name | Age |
| --- | --- |
| Alice | 25 |
| Bob | 30 |

***

## Horizontal Rule

```plain
---
```

***

## Escaping Characters

```plain
\*not italic\*
```

\*not italic\*

***

## Checkboxes

```plain
- [ ] Unchecked
- [x] Checked
```

- [ ] Unchecked
- [x] Checked

***

## Footnotes

```plain
Here is a footnote reference[^1]

[^1]: Footnote text
```

***

## Collapsible Sections (GitHub)

```plain
<details>
<summary>Click me</summary>

Hidden content here

</details>
```

<details> <summary>Click me</summary>

Hidden content here

</details>

***

## Common GitHub Markdown Extras

### Syntax Highlighting

<pre> \`\`\`js const x = 10; \`\`\` </pre>

### Mentions & References

```plain
@username
#123
```
