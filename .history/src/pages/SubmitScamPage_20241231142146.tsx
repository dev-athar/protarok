// import { useState } from "react";
// // Import the Supabase client
// import { supabase } from "../supabase"; // Ensure you have a supabase.js file exporting the initialized client

// const SubmitScamPage = () => {
//   const [formData, setFormData] = useState({
//     scamProfileName: "",
//     platform: "",
//     scamContactInfo: "",
//     dateOfScam: "",
//     description: "",
//     proof: [],
//     paymentMethod: "",
//     additionalEvidence: [],
//     victimContactInfo: "",
//     bankDetails: "",
//     paymentPlatform: "",
//     scamProfileUrl: "",
//     reportStatus: "",
//   });

//   const [isSubmitted, setIsSubmitted] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: files[0],
//     }));
//   };

//   // Upload file to Supabase Storage
//   const uploadFileToSupabase = async (file, folder) => {
//     if (!file) {
//       // console.error("No file provided for upload.");
//       return null;
//     }

//     const filePath = `${folder}/${Date.now()}-${file.name}`;
//     // console.log(`Uploading file: ${filePath}`); // Log file path for debugging

//     // Upload file to Supabase Storage
//     const { data, error } = await supabase.storage
//       .from("uploads") // Ensure the bucket name matches
//       .upload(filePath, file);

//     if (error) {
//       console.error("File upload error:", error.message);
//       return null;
//     }
//     // console.log("Upload response:", data);

//     // Generate the public URL
//     const { data: publicData, error: publicError } = supabase.storage
//       .from("uploads")
//       .getPublicUrl(filePath);

//     if (publicError) {
//       console.error("Error generating public URL:", publicError.message);
//       return null;
//     }

//     // console.log(`Public URL generated: ${publicData.publicUrl}`);
//     return publicData.publicUrl;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Ensure URL has a proper scheme
//       const normalizedUrl = formData.scamProfileUrl.trim()
//         ? formData.scamProfileUrl.trim().startsWith("http")
//           ? formData.scamProfileUrl.trim()
//           : `https://${formData.scamProfileUrl.trim()}`
//         : "";

//       // Proceed with the updated URL in the form data
//       const formDataWithUrl = {
//         ...formData,
//         scamProfileUrl: normalizedUrl,
//       };

//       // Upload files to Supabase Storage
//       const proofUrl = await uploadFileToSupabase(formData.proof, "proofs");
//       const additionalEvidenceUrl = await uploadFileToSupabase(
//         formData.additionalEvidence,
//         "additionalEvidence"
//       );

//       // Insert data into Supabase database
//       const { error } = await supabase.from("scamReports").insert([
//         {
//           ...formDataWithUrl,
//           proof: proofUrl || null,
//           additionalEvidence: additionalEvidenceUrl || null,
//           submittedAt: new Date(), // Add timestamp
//         },
//       ]);

//       if (error) {
//         throw new Error(error.message);
//       }

//       // Reset form and show confirmation message
//       setFormData({
//         scamProfileName: "",
//         platform: "",
//         scamContactInfo: "",
//         dateOfScam: "",
//         description: "",
//         proof: null,
//         paymentMethod: "",
//         additionalEvidence: null,
//         victimContactInfo: "",
//         bankDetails: "",
//         paymentPlatform: "",
//         scamProfileUrl: "",
//         reportStatus: "",
//       });
//       setIsSubmitted(true);

//       // Hide confirmation message after a timeout
//       setTimeout(() => setIsSubmitted(false), 5000);
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert(
//         "An error occurred while submitting your report. Please try again."
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <header className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-blue-600">
//           Submit a Scam Report
//         </h1>
//         <p className="text-lg text-gray-700 mt-2">
//           Help others stay safe by reporting your scam experience.
//         </p>
//       </header>

//       <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
//         {isSubmitted && (
//           <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-lg">
//             Thank you! Your report has been submitted and is pending admin
//             approval.
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           {/* Scam Profile Name */}
//           <div className="mb-4">
//             <label
//               htmlFor="scamProfileName"
//               className="block text-lg font-semibold text-gray-800"
//             >
//               Scammer’s Profile Name or Business Name
//             </label>
//             <input
//               type="text"
//               id="scamProfileName"
//               name="scamProfileName"
//               value={formData.scamProfileName}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter profile or business name"
//               required
//             />
//           </div>

//           {/* Platform Used */}
//           <div className="mb-4">
//             <label
//               htmlFor="platform"
//               className="block text-lg font-semibold text-gray-800"
//             >
//               Platform Used
//             </label>
//             <select
//               id="platform"
//               name="platform"
//               value={formData.platform}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             >
//               <option value="">Select Platform</option>
//               <option value="Facebook">Facebook</option>
//               <option value="Website">Website</option>
//               <option value="Phone">Phone</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>

//           {/* Scammer’s Bank Details */}
//           <div className="mb-4">
//             <label
//               htmlFor="bankDetails"
//               className="block text-lg font-semibold text-gray-800"
//             >
//               Scammer’s Bank Details
//             </label>
//             <input
//               type="text"
//               id="bankDetails"
//               name="bankDetails"
//               value={formData.bankDetails}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="e.g., bKash/Nagad account or bank details"
//               required
//             />
//           </div>

//           {/* Payment Platform */}
//           <div className="mb-4">
//             <label
//               htmlFor="paymentPlatform"
//               className="block text-lg font-semibold text-gray-800"
//             >
//               Payment Platform Used
//             </label>
//             <input
//               type="text"
//               id="paymentPlatform"
//               name="paymentPlatform"
//               value={formData.paymentPlatform}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="e.g., bKash, Nagad, etc."
//             />
//           </div>

//           {/* Date and Time of Scam */}
//           <div className="mb-4">
//             <label
//               htmlFor="dateOfScam"
//               className="block text-lg font-semibold text-gray-800"
//             >
//               Date and Time of Scam
//             </label>
//             <input
//               type="datetime-local"
//               id="dateOfScam"
//               name="dateOfScam"
//               value={formData.dateOfScam}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           {/* Description */}
//           <div className="mb-4">
//             <label
//               htmlFor="description"
//               className="block text-lg font-semibold text-gray-800"
//             >
//               Summary of the Incident
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               rows="5"
//               placeholder="Describe the scam in detail"
//               required
//             ></textarea>
//           </div>

//           {/* Supporting Evidence */}
//           <div className="mb-4">
//             <label
//               htmlFor="proof"
//               className="block text-lg font-semibold text-gray-800"
//             >
//               Upload Supporting Evidence
//             </label>
//             <input
//               type="file"
//               id="proof"
//               name="proof"
//               accept="image/*,.pdf"
//               onChange={handleFileChange}
//               className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           {/* Additional Evidence */}
//           <div className="mb-4">
//             <label
//               htmlFor="additionalEvidence"
//               className="block text-lg font-semibold text-gray-800"
//             >
//               Upload Additional Evidence (Optional)
//             </label>
//             <input
//               type="file"
//               id="additionalEvidence"
//               name="additionalEvidence"
//               accept="image/*,.pdf"
//               onChange={handleFileChange}
//               className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Victim Contact Info */}
//           <div className="mb-4">
//             <label
//               htmlFor="victimContactInfo"
//               className="block text-lg font-semibold text-gray-800"
//             >
//               Your Contact Info (Optional)
//             </label>
//             <input
//               type="text"
//               id="victimContactInfo"
//               name="victimContactInfo"
//               value={formData.victimContactInfo}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Email or phone (optional)"
//             />
//           </div>

//           {/* Scammer Profile URL */}
//           <div className="mb-4">
//             <label
//               htmlFor="scamProfileUrl"
//               className="block text-lg font-semibold text-gray-800"
//             >
//               Scammer’s Profile URL (Optional)
//             </label>
//             <input
//               type="text"
//               id="scamProfileUrl"
//               name="scamProfileUrl"
//               value={formData.scamProfileUrl}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter scammer's profile URL (Optional)"
//             />
//           </div>

//           {/* Report Status */}
//           <div className="mb-4">
//             <label
//               htmlFor="reportStatus"
//               className="block text-lg font-semibold text-gray-800"
//             >
//               Report Status (Optional)
//             </label>
//             <input
//               type="text"
//               id="reportStatus"
//               name="reportStatus"
//               value={formData.reportStatus}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Status of report, like Information about complaints made to authorities"
//             />
//           </div>

//           {/* Submit Button */}
//           <div className="text-center">
//             <button
//               type="submit"
//               className="bg-blue-600 text-white py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition duration-300"
//             >
//               Submit Scam Report
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SubmitScamPage;

Chat history



ChatGPT 4o
You said:
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// Import the Supabase client
import { supabase } from "../supabase"; // Ensure you have a supabase.js file exporting the initialized client

const SubmitScamPage = () => {
  const [formData, setFormData] = useState({
    scamProfileName: "",
    platform: "",
    scamContactInfo: "",
    dateOfScam: "",
    description: "",
    proof: null,
    paymentMethod: "",
    additionalEvidence: null,
    victimContactInfo: "",
    bankDetails: "",
    paymentPlatform: "",
    scamProfileUrl: "",
    reportStatus: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  // Upload file to Supabase Storage
  const uploadFileToSupabase = async (file, folder) => {
    if (!file) {
      // console.error("No file provided for upload.");
      return null;
    }

    const filePath = ${folder}/${Date.now()}-${file.name};
    // console.log(Uploading file: ${filePath}); // Log file path for debugging

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("uploads") // Ensure the bucket name matches
      .upload(filePath, file);

    if (error) {
      console.error("File upload error:", error.message);
      return null;
    }
    // console.log("Upload response:", data);

    // Generate the public URL
    const { data: publicData, error: publicError } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath);

    if (publicError) {
      console.error("Error generating public URL:", publicError.message);
      return null;
    }

    // console.log(Public URL generated: ${publicData.publicUrl});
    return publicData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Ensure URL has a proper scheme
      const normalizedUrl = formData.scamProfileUrl.trim()
        ? formData.scamProfileUrl.trim().startsWith("http")
          ? formData.scamProfileUrl.trim()
          : https://${formData.scamProfileUrl.trim()}
        : "";

      // Proceed with the updated URL in the form data
      const formDataWithUrl = {
        ...formData,
        scamProfileUrl: normalizedUrl,
      };

      // Upload files to Supabase Storage
      const proofUrl = await uploadFileToSupabase(formData.proof, "proofs");
      const additionalEvidenceUrl = await uploadFileToSupabase(
        formData.additionalEvidence,
        "additionalEvidence"
      );

      // Insert data into Supabase database
      const { error } = await supabase.from("scamReports").insert([
        {
          ...formDataWithUrl,
          proof: proofUrl || null,
          additionalEvidence: additionalEvidenceUrl || null,
          submittedAt: new Date(), // Add timestamp
        },
      ]);

      if (error) {
        throw new Error(error.message);
      }

      // Reset form and show confirmation message
      setFormData({
        scamProfileName: "",
        platform: "",
        scamContactInfo: "",
        dateOfScam: "",
        description: "",
        proof: null,
        paymentMethod: "",
        additionalEvidence: null,
        victimContactInfo: "",
        bankDetails: "",
        paymentPlatform: "",
        scamProfileUrl: "",
        reportStatus: "",
      });
      setIsSubmitted(true);

      // Hide confirmation message after a timeout
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        "An error occurred while submitting your report. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">
          Submit a Scam Report
        </h1>
        <p className="text-lg text-gray-700 mt-2">
          Help others stay safe by reporting your scam experience.
        </p>
      </header>

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {isSubmitted && (
          <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-lg">
            Thank you! Your report has been submitted and is pending admin
            approval.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Scam Profile Name */}
          <div className="mb-4">
            <label
              htmlFor="scamProfileName"
              className="block text-lg font-semibold text-gray-800"
            >
              Scammer’s Profile Name or Business Name
            </label>
            <input
              type="text"
              id="scamProfileName"
              name="scamProfileName"
              value={formData.scamProfileName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter profile or business name"
              required
            />
          </div>

          {/* Platform Used */}
          <div className="mb-4">
            <label
              htmlFor="platform"
              className="block text-lg font-semibold text-gray-800"
            >
              Platform Used
            </label>
            <select
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Platform</option>
              <option value="Facebook">Facebook</option>
              <option value="Website">Website</option>
              <option value="Phone">Phone</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Scammer’s Bank Details */}
          <div className="mb-4">
            <label
              htmlFor="bankDetails"
              className="block text-lg font-semibold text-gray-800"
            >
              Scammer’s Bank Details
            </label>
            <input
              type="text"
              id="bankDetails"
              name="bankDetails"
              value={formData.bankDetails}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., bKash/Nagad account or bank details"
              required
            />
          </div>

          {/* Payment Platform */}
          <div className="mb-4">
            <label
              htmlFor="paymentPlatform"
              className="block text-lg font-semibold text-gray-800"
            >
              Payment Platform Used
            </label>
            <input
              type="text"
              id="paymentPlatform"
              name="paymentPlatform"
              value={formData.paymentPlatform}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., bKash, Nagad, etc."
            />
          </div>

          {/* Date and Time of Scam */}
          <div className="mb-4">
            <label
              htmlFor="dateOfScam"
              className="block text-lg font-semibold text-gray-800"
            >
              Date and Time of Scam
            </label>
            <input
              type="datetime-local"
              id="dateOfScam"
              name="dateOfScam"
              value={formData.dateOfScam}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-lg font-semibold text-gray-800"
            >
              Summary of the Incident
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="5"
              placeholder="Describe the scam in detail"
              required
            ></textarea>
          </div>

          {/* Supporting Evidence */}
          <div className="mb-4">
            <label
              htmlFor="proof"
              className="block text-lg font-semibold text-gray-800"
            >
              Upload Supporting Evidence
            </label>
            <input
              type="file"
              id="proof"
              name="proof"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Additional Evidence */}
          <div className="mb-4">
            <label
              htmlFor="additionalEvidence"
              className="block text-lg font-semibold text-gray-800"
            >
              Upload Additional Evidence (Optional)
            </label>
            <input
              type="file"
              id="additionalEvidence"
              name="additionalEvidence"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Victim Contact Info */}
          <div className="mb-4">
            <label
              htmlFor="victimContactInfo"
              className="block text-lg font-semibold text-gray-800"
            >
              Your Contact Info (Optional)
            </label>
            <input
              type="text"
              id="victimContactInfo"
              name="victimContactInfo"
              value={formData.victimContactInfo}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email or phone (optional)"
            />
          </div>

          {/* Scammer Profile URL */}
          <div className="mb-4">
            <label
              htmlFor="scamProfileUrl"
              className="block text-lg font-semibold text-gray-800"
            >
              Scammer’s Profile URL (Optional)
            </label>
            <input
              type="text"
              id="scamProfileUrl"
              name="scamProfileUrl"
              value={formData.scamProfileUrl}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter scammer's profile URL (Optional)"
            />
          </div>

          {/* Report Status */}
          <div className="mb-4">
            <label
              htmlFor="reportStatus"
              className="block text-lg font-semibold text-gray-800"
            >
              Report Status (Optional)
            </label>
            <input
              type="text"
              id="reportStatus"
              name="reportStatus"
              value={formData.reportStatus}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Status of report, like Information about complaints made to authorities"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition duration-300"
            >
              Submit Scam Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitScamPage;


update for multiple file upload, just changed code
ChatGPT said:
ChatGPT
To enable multiple file uploads, you'll need to adjust both the file input fields and the logic for handling and uploading multiple files. Here's the updated version of your code:

The updated code allows for multiple file uploads by changing the proof and additionalEvidence fields to accept multiple files. It uses the multiple attribute in the file input elements and adjusts the uploadFilesToSupabase function to handle arrays of files. This ensures that all selected files are uploaded and their URLs are stored in the database.





You said:
Asked ChatGPT

add drag and drop feature
ChatGPT said:
ChatGPT
The drag-and-drop feature has been added for file uploads







ChatGPT can make mistakes. Check important info.
?
ChatGPT is still generating a response...

Multiple File Upload
163
164
165
166
167
168
169
170
171
172
173
174
175
176
177
178
179
180
181
182
183
184
185
186
187
188
189
190
191
192
193
194
195
196
197
198
199
200
201
202
203
204
205
206
207
208
209
210
211
212
213
214
215
216
217
218
219
220
221
222
223
224
225
226
227
228
        <form onSubmit={handleSubmit}>
          {/* Other form fields */}

          {/* Supporting Evidence */}
          <div
            className="mb-4 border-dashed border-2 border-gray-300 p-4 rounded-lg"
            onDrop={(e) => handleDrop(e, "proof")}
            onDragOver={handleDragOver}
          >
            <label
              htmlFor="proof"
              className="block text-lg font-semibold text-gray-800"
            >
              Upload Supporting Evidence (Drag & Drop or Click)
            </label>
            <input
              type="file"
              id="proof"
              name="proof"
              accept="image/*,.pdf"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-gray-500 mt-2">Drag & drop files here, or click to select files.</p>
          </div>

          {/* Additional Evidence */}
          <div
            className="mb-4 border-dashed border-2 border-gray-300 p-4 rounded-lg"
            onDrop={(e) => handleDrop(e, "additionalEvidence")}
            onDragOver={handleDragOver}
          >
            <label
              htmlFor="additionalEvidence"
              className="block text-lg font-semibold text-gray-800"
            >
              Upload Additional Evidence (Optional, Drag & Drop or Click)
            </label>
            <input
              type="file"
              id="additionalEvidence"
              name="additionalEvidence"
              accept="image/*,.pdf"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-gray-500 mt-2">Drag & drop files here, or click to select files.</p>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition duration-300"
            >
              Submit Scam Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitScamPage;
