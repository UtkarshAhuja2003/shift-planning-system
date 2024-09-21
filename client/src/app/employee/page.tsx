"use client";
import Link from "next/link";
import { useEffect } from "react";
import { getAccessToken } from "@/api/auth";

const EmployeeHomePage = () => {
  useEffect(() => {
    const fetchAccessToken = async () => {
      const accessToken = (await getAccessToken()).accessToken;
      if (!accessToken) {
        window.location.href = "/";
      }
    };

    fetchAccessToken();
  }, []);

  return (
    <div className="text-center mt-12">
      <h1 className="text-2xl mb-8">Employee Dashboard</h1>
      <div>
        <Link href="/employee/availibility">
            <button
            className="px-4 py-2 mr-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
            Check Availability
            </button>
        </Link>
        <Link href="/employee/shift">
            <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
            Check Shifts
            </button>
        </Link>
      </div>
    </div>
  );
};

export default EmployeeHomePage;
