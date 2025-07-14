import { getRandomName } from "./name.js";

const Symptoms = Object.freeze({
  CHEST_PAIN: "Chest pain",
  RUNNY_NOSE: "Runny nose",
  FEVER: "Fever",
});

const Treatments = Object.freeze({
  EMERGENCY_REFERRAL: "EMERGENCY_REFERRAL",
});

export class Patient {
  name = getRandomName();
  description = "Lorem ipsum";
  symptoms = [];

  onEndTurn() {
    throw new Error("Override this during runtime");
  }
}

export class PatientFactory {
  static symptomValues = Object.values(Symptoms);

  constructor() {
    throw new Error("This class is not meant to be instantiated!");
  }

  static createInitialPatients(count) {
    const patients = [];
    for (let i = 0; i < count; i++) {
      const patient = new Patient();
      patient.symptoms.push(
        this.symptomValues[
          Math.floor(Math.random() * this.symptomValues.length)
        ]
      );
      patients.push(patient);
    }
    return patients;
  }
}
