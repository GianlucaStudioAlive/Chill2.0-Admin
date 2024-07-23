"use client";

import { useState } from "react";
import { useSupabase } from "./supabaseContext";
import Image from "next/image";
import { Button } from "react-bootstrap";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, error } = useSupabase();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signIn(email, password);
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div className="container ">
      <div className="row vh-100 d-grid align-items-center justify-content-center ">
        <div className="col-12 text-center d-flex aling-items-end ">
          <div className="row d-flex justify-content-center ">
            <div className="col-lg-12">
              <Image
                src={"/Chill_Logo_Index.png"}
                width={1000}
                height={1000}
                alt="sofa"
                className="titolo"
                style={{ width: "300px", height: "auto" }}
              />
            </div>

            <div className="col-8 col-md-6 mt-4">
              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%" }}
                  className="mt-2 p-1"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%" }}
                  className="mt-2 p-1"
                />

                <div className="row d-flex justify-content-center mt-3">
                  <div className="col">
                    <Button variant="dark" type="submit">
                      Login
                    </Button>
                  </div>
                  <div className="col-12"> {error && error}</div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
