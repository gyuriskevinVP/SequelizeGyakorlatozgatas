import Sequelize from "sequelize";
const { DataTypes, Op } = Sequelize;

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  define: {
    timestamps: false,
  },
  logging: false,
});

const student = sequelize.define("student", {
  student_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [4, 20],
    },
  },
  favorite_class: {
    type: DataTypes.STRING,
    defaultValue: "Computer Science",
  },
  school_year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  has_language_examination: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

// student
//   .sync({ force: true })
//   .then(() => {
//     return student.bulkCreate([
//       {
//         name: "Kevin",
//         favorite_class: "PE",
//         school_year: 14,
//         has_language_examination: true,
//       },
//       {
//         name: "Norbert",
//         school_year: 11,
//         has_language_examination: true,
//       },
//       {
//         name: "Richie",
//         favorite_class: "Science",
//         school_year: 9,
//         has_language_examination: false,
//       },
//       {
//         name: "Kovi",
//         school_year: 12,
//         has_language_examination: false,
//       },
//       {
//         name: "Balázs",
//         favorite_class: "History",
//         school_year: 14,
//         has_language_examination: false,
//       },
//     ]);
//   });

student
  .sync({ alter: true })
  .then(() => {
    return student.findAll({
      attributes: ["name"],
      where: {
        [Op.or]: [
          { favorite_class: "Computer Science" },
          { has_language_examination: true },
        ],
      },
    });
  })
  .then((data) => {
    data.forEach((element) => {
      console.log(element.toJSON());
    });
  })
  .catch((err) => {
    console.log(`Error: ${err.message}`);
  });

student
  .sync({ alter: true })
  .then(() => {
    return student.findAll({
      attributes: [
        "school_year",
        [Sequelize.fn("COUNT", Sequelize.col("student_id")), "num_students"],
      ],
      group: ["school_year"],
      raw: true,
    });
  })
  .then((data) => {
    data.forEach((element) => {
      console.log(element);
    });
  })
  .catch((err) => {
    console.log(`Error: ${err.message}`);
  });
