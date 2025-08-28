{
  "name": "Character",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Character name"
    },
    "class": {
      "type": "string",
      "enum": [
        "warrior",
        "mage",
        "rogue",
        "healer"
      ],
      "default": "warrior"
    },
    "level": {
      "type": "number",
      "default": 1
    },
    "experience": {
      "type": "number",
      "default": 0
    },
    "health": {
      "type": "number",
      "default": 100
    },
    "mana": {
      "type": "number",
      "default": 50
    },
    "strength": {
      "type": "number",
      "default": 10
    },
    "intelligence": {
      "type": "number",
      "default": 10
    },
    "agility": {
      "type": "number",
      "default": 10
    },
    "avatar_config": {
      "type": "object",
      "properties": {
        "skin_color": {
          "type": "string",
          "default": "#ffdbac"
        },
        "hair_color": {
          "type": "string",
          "default": "#4a4a4a"
        },
        "hair_style": {
          "type": "string",
          "default": "short"
        },
        "eye_color": {
          "type": "string",
          "default": "#2196f3"
        },
        "body_type": {
          "type": "string",
          "default": "medium"
        }
      }
    },
    "position": {
      "type": "object",
      "properties": {
        "x": {
          "type": "number",
          "default": 0
        },
        "y": {
          "type": "number",
          "default": 0
        },
        "z": {
          "type": "number",
          "default": 0
        }
      }
    }
  },
  "required": [
    "name"
  ]
}
