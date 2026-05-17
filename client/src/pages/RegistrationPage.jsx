import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createProduct } from "../api/productApi";

export default function RegistrationPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    tags: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.description || !form.price) {
      alert("상품명, 설명, 가격은 입력해주세요.");
      return;
    }

    const tags = form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    try {
      const created = await createProduct({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        tags,
      });

      navigate(`/items/${created.id}`);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <main className="registration-page">
      <div className="registration-wrap">
        <h1>상품 등록하기</h1>

        <form className="registration-form" onSubmit={handleSubmit}>
          <label>
            상품명
            <input name="name" value={form.name} onChange={handleChange} />
          </label>

          <label>
            상품 소개
            <textarea name="description" value={form.description} onChange={handleChange} />
          </label>

          <label>
            판매 가격
            <input name="price" type="number" value={form.price} onChange={handleChange} />
          </label>

          <label>
            태그
            <input name="tags" value={form.tags} onChange={handleChange} />
          </label>

          <button className="submit-button" type="submit">
            등록하기
          </button>
        </form>
      </div>
    </main>
  );
}
