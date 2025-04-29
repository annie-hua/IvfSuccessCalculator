'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';

const formSchema = z.object({
  usingOwnEggs: z.string().nonempty("Please select an option"),
  previousIVF: z.string().nonempty("Please select an option"),
  reasonKnown: z.string().nonempty("Please select an option"),

  age: z.string().refine(val => {
    const num = parseInt(val);
    return num >= 20 && num <= 50;
  }, "Age must be between 20 and 50"),
  weight: z.string().min(1, "Weight is required"),
  heightFeet: z.string().min(1, "Feet is required"),
  heightInches: z.string().min(1, "Inches is required"),
  priorPregnancies: z.string().nonempty("Please select an option"),
  priorLiveBirths: z.string().nonempty("Please select an option"),
  ivfReasons: z.array(z.string()).min(1, "Select at least one reason"),
}).refine((data) => {
  const priorPregnancies = parseInt(data.priorPregnancies);
  const priorLiveBirths = parseInt(data.priorLiveBirths);
  return isNaN(priorPregnancies) || isNaN(priorLiveBirths) || priorLiveBirths <= priorPregnancies;
}, {
  message: "The number of live births cannot exceed the number of prior pregnancies.",
  path: ["priorLiveBirths"],
});

type FormType = z.infer<typeof formSchema>;

export default function Page() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });
  const [knownInfertility, setKnownInfertility] = useState(false);

  const onSubmit = async (data: FormType) => {
    console.log('onSubmit');

    const reasonMap: Record<string, string> = {
      "Male factor infertility": "hasMaleFactorInfertility",
      "Endometriosis": "hasEndometriosis",
      "Tubal factor": "hasTubalFactor",
      "Ovulatory disorder (including PCOS)": "hasOvulatoryDisorder",
      "Diminished ovarian reserve": "hasDiminishedOvarianReserve",
      "Uterine factor": "hasUterineFactor",
      "Other reason": "hasOtherReason",
      "Unexplained (Idiopathic) infertility": "hasUnexplainedInfertility",
      "I don’t know/no reason": "hasUnknownReason",
    };

    const reasonFlags = Object.entries(reasonMap).reduce((flags, [label, key]) => {
      flags[key] = data.ivfReasons.includes(label);
      return flags;
    }, {} as Record<string, boolean>);

    const payload = {
      usingOwnEggs: data.usingOwnEggs,
      previousIVF: data.previousIVF,
      reasonKnown: data.reasonKnown,
      age: parseInt(data.age, 10),
      weight: parseFloat(data.weight),
      heightFeet: parseInt(data.heightFeet, 10),
      heightInches: parseInt(data.heightInches, 10),
      priorPregnancies: parseInt(data.priorPregnancies, 10),
      priorLiveBirths: parseInt(data.priorLiveBirths, 10),
      ...reasonFlags,
    };

    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      alert(`Estimated success rate: ${result.result}`);
    } catch (err) {
      console.error(err);
      alert("Calculation failed");
    }
  };

  // Clean combined subscription
  useEffect(() => {
    const subscription = watch((values) => {
      setKnownInfertility(values.reasonKnown === "TRUE");

      if (values.usingOwnEggs === "FALSE") {
        setValue("previousIVF", "N/A");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">IVF Success Estimator</h1>
      <h2 className="text-lg font-semibold">Please fill out the form below:</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Egg Source */}
        <div>
          <label>Do you plan to use your own eggs or donor eggs?</label>
          <select {...register("usingOwnEggs")} defaultValue="" className="w-full p-2 border rounded text-gray-900">
            <option value="" disabled>select an option</option>
            <option value="TRUE">Yes</option>
            <option value="FALSE">No</option>
          </select>
          {errors.usingOwnEggs && <p className="text-red-500 text-sm">{errors.usingOwnEggs.message}</p>}
        </div>

        {/* Previous IVF */}
        <div>
          <label>Have they used IVF in the past?</label>
          <select {...register("previousIVF")} defaultValue="" className="w-full p-2 border rounded text-gray-900">
            <option value="" disabled>select an option</option>
            <option value="TRUE">Yes</option>
            <option value="FALSE">No</option>
            <option value="N/A">N/A</option>
          </select>
          {errors.previousIVF && <p className="text-red-500 text-sm">{errors.previousIVF.message}</p>}
        </div>

        {/* Known Infertility */}
        <div>
          <label>Do they know the reason for your infertility?</label>
          <select {...register("reasonKnown")} defaultValue="" className="w-full p-2 border rounded text-gray-900">
            <option value="" disabled>select an option</option>
            <option value="TRUE">Yes</option>
            <option value="FALSE">No</option>
          </select>
          {errors.reasonKnown && <p className="text-red-500 text-sm">{errors.reasonKnown.message}</p>}
        </div>

        {/* Age */}
        <div>
          <label>How old are you?</label>
          <input {...register("age")} className="w-full p-2 border rounded" />
          {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
        </div>

        {/* Weight */}
        <div>
          <label>How much do you weigh?</label>
          <input {...register("weight")} className="w-full p-2 border rounded" />
          {errors.weight && <p className="text-red-500 text-sm">{errors.weight.message}</p>}
        </div>

        {/* Height */}
        <div>
          <label>How tall are you?</label>
          <div className="flex gap-4">
            <input {...register("heightFeet")} placeholder="Feet" className="w-1/2 p-2 border rounded" />
            <input {...register("heightInches")} placeholder="Inches" className="w-1/2 p-2 border rounded" />
          </div>
          {errors.heightFeet && <p className="text-red-500 text-sm">{errors.heightFeet.message}</p>}
          {errors.heightInches && <p className="text-red-500 text-sm">{errors.heightInches.message}</p>}
        </div>

        {/* IVF Reasons */}
        {knownInfertility && (
          <div>
            <label>What is the reason you are using IVF? (select all that apply)</label>
            <div className="space-y-2 mt-2">
              {[
                "Male factor infertility",
                "Endometriosis",
                "Tubal factor",
                "Ovulatory disorder (including PCOS)",
                "Diminished ovarian reserve",
                "Uterine factor",
                "Other reason",
                "Unexplained (Idiopathic) infertility",
                "I don’t know/no reason",
              ].map((reason, idx) => (
                <label key={idx} className="flex items-center gap-2">
                  <input type="checkbox" value={reason} {...register("ivfReasons")} className="accent-blue-600" />
                  {reason}
                </label>
              ))}
            </div>
            {errors.ivfReasons && <p className="text-red-500 text-sm">{errors.ivfReasons.message}</p>}
          </div>
        )}

        {/* Prior Pregnancies */}
        <div>
          <label>How many prior pregnancies have you had?</label>
          <select {...register("priorPregnancies")} defaultValue="" className="w-full p-2 border rounded text-gray-900">
            <option value="" disabled>select an option</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2+</option>
          </select>
          {errors.priorPregnancies && <p className="text-red-500 text-sm">{errors.priorPregnancies.message}</p>}
        </div>

        {/* Prior Live Births */}
        <div>
          <label>How many prior live births have you had?</label>
          <select {...register("priorLiveBirths")} defaultValue="" className="w-full p-2 border rounded text-gray-900">
            <option value="" disabled>select an option</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2+</option>
          </select>
          {errors.priorLiveBirths && <p className="text-red-500 text-sm">{errors.priorLiveBirths.message}</p>}
        </div>

        {/* Submit */}
        <div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
