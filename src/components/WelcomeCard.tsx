import { PiHandWaving } from "react-icons/pi";

export function WelcomeCard() {
  return (
    <div className="bg-teal-900 rounded-lg p-8 border border-gray-50 shadow-lg max-w-2xl mx-auto mt-8 text-center">
      <h2 className="text-2xl font-bold text-white mb-4">
        <div className="flex items-center justify-center gap-x-2">
        <PiHandWaving className="text-4xl" />
        Welcome 

        </div>
      </h2>
      <p className="text-white leading-relaxed">
        Everything CSV is an app to convert CSV files to Json, <br/> Edit the csv file and add new rows and columns with ease, all while the data staying in your browser.
      </p>
      <div className="mt-6 text-sm text-white">
        Get started by uploading a CSV file above
      </div>
    </div>
  );
} 