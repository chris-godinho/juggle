// User.js: User model

const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Must match an email address."],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    match: [
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d])/,
      "Must contain at least one letter, one number, and one special character.",
    ],
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  birthDate: {
    type: Date,
  },
  colorModeSetting: {
    type: String,
    default: "default-mode-jg",
  },
  eventSubtypes: {
    type: [
      {
        subtype: String,
        parentType: {
          type: String,
          enum: ["life", "work"],
        },
      },
    ],
    unique: true,
    default: [
      { subtype: "Family", parentType: "life" },
      { subtype: "Health", parentType: "life" },
      { subtype: "Fitness", parentType: "life" },
      { subtype: "Financial", parentType: "life" },
      { subtype: "Leisure", parentType: "life" },
      { subtype: "Shift", parentType: "work" },
      { subtype: "Meeting", parentType: "work" },
      { subtype: "Project", parentType: "work" },
      { subtype: "Networking", parentType: "work" },
      { subtype: "Education", parentType: "work" },
    ],
  },
  statSettings: {
    type: {
      showStats: Boolean,
      balanceGoal: Number,
      percentageBasis: {
        type: String,
        enum: ["waking", "fullDay"],
      },
      ignoreUnalotted: Boolean,
    },
    default: {
      showStats: true,
      balanceGoal: 50,
      percentageBasis: "waking",
      ignoreUnalotted: false,
    },
  },
  sleepingHours: {
    type: {
      sunday: {
        start: String,
        end: String,
      },
      monday: {
        start: String,
        end: String,
      },
      tuesday: {
        start: String,
        end: String,
      },
      wednesday: {
        start: String,
        end: String,
      },
      thursday: {
        start: String,
        end: String,
      },
      friday: {
        start: String,
        end: String,
      },
      saturday: {
        start: String,
        end: String,
      },
    },
    default: {
      sunday: {
        start: "11:00 PM",
        end: "7:00 AM",
      },
      monday: {
        start: "11:00 PM",
        end: "7:00 AM",
      },
      tuesday: {
        start: "11:00 PM",
        end: "7:00 AM",
      },
      wednesday: {
        start: "11:00 PM",
        end: "7:00 AM",
      },
      thursday: {
        start: "11:00 PM",
        end: "7:00 AM",
      },
      friday: {
        start: "11:00 PM",
        end: "7:00 AM",
      },
      saturday: {
        start: "11:00 PM",
        end: "7:00 AM",
      },
    },
  },
  workPreferredActivities: {
    type: {
      exercise: Boolean,
      mindfulness: Boolean,
      sleep: Boolean,
      healthAwareness: Boolean,
      reading: Boolean,
      music: Boolean,
      games: Boolean,
      movies: Boolean,
      cooking: Boolean,
      socializing: Boolean,
      sports: Boolean,
      outdoorsExploration: Boolean,
      travel: Boolean,
      journaling: Boolean,
      personalGrowth: Boolean,
      creativeExpression: Boolean,
      financialPlanning: Boolean,
      digitalDetox: Boolean,
      purposeAndMeaning: Boolean,
      boundarySetting: Boolean,
    },
    default: {
      exercise: true,
      mindfulness: true,
      sleep: true,
      healthAwareness: true,
      reading: true,
      music: true,
      games: true,
      movies: true,
      cooking: true,
      socializing: true,
      sports: true,
      outdoorsExploration: true,
      travel: true,
      journaling: true,
      personalGrowth: true,
      creativeExpression: true,
      financialPlanning: true,
      digitalDetox: true,
      purposeAndMeaning: true,
      boundarySetting: true,
    },
  },
  lifePreferredActivities: {
    type: {
      goalSetting: Boolean,
      skillDevelopment: Boolean,
      industryResearch: Boolean,
      mentorship: Boolean,
      softSkills: Boolean,
      networking: Boolean,
      branding: Boolean,
      progressEvaluation: Boolean,
      teamBuilding: Boolean,
      teamFeedback: Boolean,
      customerFeedback: Boolean,
      qualityAssurance: Boolean,
      brainstorming: Boolean,
      innovationMindset: Boolean,
      technologyIntegration: Boolean,
      teamIntegration: Boolean,
      milestoneCelebration: Boolean,
      reverseMentorship: Boolean,
      volunteering: Boolean,
      entrepreneurship: Boolean,
    },
    default: {
      goalSetting: true,
      skillDevelopment: true,
      industryResearch: true,
      mentorship: true,
      softSkills: true,
      networking: true,
      branding: true,
      progressEvaluation: true,
      teamBuilding: true,
      teamFeedback: true,
      customerFeedback: true,
      qualityAssurance: true,
      brainstorming: true,
      innovationMindset: true,
      technologyIntegration: true,
      teamIntegration: true,
      milestoneCelebration: true,
      reverseMentorship: true,
      volunteering: true,
      entrepreneurship: true,
    },
  },
  eventSettings: {
    type: {
      completeAfterEnd: Boolean,
    },
    default: {
      completeAfterEnd: false,
    },
  },
  layoutSettings: {
    type: {
      dashBoardLayout: {
        type: String,
        enum: [
          "two-sidebars",
          "one-sidebar-left",
          "one-sidebar-right",
          "no-sidebars",
        ],
      },
      viewStyle: {
        type: String,
        enum: ["calendar", "task-list"],
      },
    },
    default: {
      dashBoardLayout: "two-sidebars",
      viewStyle: "calendar",
    },
  },
  localizationSettings: {
    type: {
      timeZone: Number,
      dateFormat: {
        type: String,
        enum: [
          "mm-dd-yyyy",
          "dd-mm-yyyy",
          "yyyy-mm-dd",
          "yyyy-dd-mm",
          "month-dd-yyyy",
          "dd-month-yyyy",
        ],
      },
      timeFormat: {
        type: String,
        enum: ["12-hour", "24-hour"],
      },
    },
    default: {
      timeZone: 0,
      dateFormat: "mm-dd-yyyy",
      timeFormat: "12-hour",
    },
  },
  events: [
    {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

module.exports = User;
