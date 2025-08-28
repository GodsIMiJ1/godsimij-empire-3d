{
  "name": "Companion",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Companion name"
    },
    "personality": {
      "type": "string",
      "description": "AI personality traits"
    },
    "type": {
      "type": "string",
      "enum": [
        "dragon",
        "fairy",
        "robot",
        "familiar"
      ],
      "default": "familiar"
    },
    "level": {
      "type": "number",
      "default": 1
    },
    "loyalty": {
      "type": "number",
      "default": 50,
      "description": "Companion loyalty level"
    },
    "abilities": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "default": []
    },
    "avatar_config": {
      "type": "object",
      "properties": {
        "color": {
          "type": "string",
          "default": "#9c27b0"
        },
        "size": {
          "type": "string",
          "default": "medium"
        },
        "glow": {
          "type": "boolean",
          "default": true
        }
      }
    },
    "conversation_history": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "message": {
            "type": "string"
          },
          "sender": {
            "type": "string"
          },
          "timestamp": {
            "type": "string"
          }
        }
      },
      "default": []
    }
  },
  "required": [
    "name",
    "personality"
  ]
}
