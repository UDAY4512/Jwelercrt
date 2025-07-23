import { useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";

const AddProduct = () => {
  const [image, setImage] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    gender: "",
    category: "",
    carat: "",
    price: "",
  });

  const [status, setStatus] = useState(null);

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file) setImage((prev) => [...prev, file]);
  };

  const handleRemoveImage = (index) => {
    setImage(image.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("gender", formData.gender);
    data.append("category", formData.category);
    data.append("carat", formData.carat);
    data.append("price", formData.price);

    image.forEach((img) => data.append("images", img));

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/products/upload",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(res.data.message || "Product added successfully!");
      setStatus("success");
      setFormData({
        title: "",
        description: "",
        gender: "",
        category: "",
        carat: "",
        price: "",
      });
      setImage([]);
    } catch (err) {
      setStatus("error");
      console.log(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        ></textarea>

        <div className="grid grid-cols-2 gap-4">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="">Gender</option>
            <option value="man">Men</option>
            <option value="woman">Women</option>
          </select>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="">Category</option>
            <option value="Ring">Ring</option>
            <option value="Chain">Chain</option>
            <option value="Kada">Kada</option>
            <option value="Bracelet">Bracelet</option>
          </select>

          <select
            name="carat"
            value={formData.carat}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="">Carat</option>
            <option value="18K">18K</option>
            <option value="22K">22K</option>
            <option value="24K">24K</option>
          </select>

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>

        <div>
          <label className="font-semibold mb-1 block">Images</label>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            {image.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs hidden group-hover:block"
                >
                  ×
                </button>
              </div>
            ))}

            <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed rounded cursor-pointer hover:bg-gray-100">
              <Plus />
              <input
                type="file"
                accept="image/*"
                onChange={handleAddImage}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload Product
        </button>

        {status === "success" && (
          <p className="text-green-600">✅ Product uploaded!</p>
        )}
        {status === "error" && (
          <p className="text-red-600">❌ Upload failed. Please try again.</p>
        )}
      </form>
    </div>
  );
};

export default AddProduct;
