import connectMongoDB from "@/lib/mongodb";
import EmergencyContact from "@/models/EmergencyContact";
import SOS from "@/models/SOS";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const emailServer = process.env.EMAIL_SERVER;
const emailPort = process.env.EMAIL_PORT;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

// Check if Email is properly configured
const isEmailConfigured =
  emailUser &&
  emailPass &&
  !emailUser.includes("your-email") &&
  !emailPass.includes("your-app-password");

export async function POST(req) {
  await connectMongoDB();
  try {
    const { latitude, longitude } = await req.json();

    // 1. Fetch the emergency contact
    const contact = await EmergencyContact.findOne();
    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No emergency contact found. Please set one up in the Emergency page first.",
        },
        { status: 400 },
      );
    }

    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const messageSubject = `🚨 EMERGENCY: GoRide SOS Alert for Student 🚨`;
    const messageHtml = `
      <div style="font-family: sans-serif; padding: 20px; border: 2px solid red; border-radius: 10px; max-width: 500px;">
        <h2 style="color: red;">🚨 EMERGENCY SOS ALERT 🚨</h2>
        <p>Your trusted contact, <strong>${contact.name}</strong>, has triggered an emergency alert.</p>
        <p><strong>Current Location:</strong> <a href="${googleMapsUrl}" style="color: #007bff; font-weight: bold; text-decoration: none;">📍 View on Google Maps</a></p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 5px solid red; margin: 20px 0;">
          <strong>Coordinates:</strong><br/>
          Latitude: ${latitude}<br/>
          Longitude: ${longitude}
        </div>
        <p style="color: #666; font-size: 12px; border-top: 1px solid #eee; pt: 10px;">
          Sent via GoRide Student Carpool Safety System
        </p>
      </div>
    `;

    let status = "Sent";
    let errorMessage = null;
    let previewUrl = null;
    let transporter;

    // 2. Configure Transporter
    if (isEmailConfigured) {
      // Production Mode (Real SMTP)
      transporter = nodemailer.createTransporter({
        host: emailServer,
        port: parseInt(emailPort),
        secure: emailPort === "465",
        auth: { user: emailUser, pass: emailPass },
      });
    } else {
      // Auto-Demo Mode (Ethereal Email - No signup required)
      console.log("--- SOS AUTO-DEMO MODE ---");
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
      status = "Logged (Dev Mode)";
    }

    // 3. Send the Email
    try {
      const info = await transporter.sendMail({
        from: isEmailConfigured
          ? `"GoRide SOS" <${emailUser}>`
          : '"GoRide Demo SOS" <sos@goride.test>',
        to: contact.email,
        subject: messageSubject,
        html: messageHtml,
        text: `EMERGENCY SOS! I need help. My location: ${googleMapsUrl}`,
      });

      if (!isEmailConfigured) {
        previewUrl = nodemailer.getTestMessageUrl(info);
        console.log(`SOS Test Email Sent! View here: ${previewUrl}`);
      }
    } catch (err) {
      console.error("Email Delivery Failed:", err);
      status = "Failed";
      errorMessage = err.message;
    }

    // 4. Log the event in the database
    const savedSos = await SOS.create({
      latitude,
      longitude,
      contactName: contact.name,
      contactPhone: contact.phone,
      contactEmail: contact.email,
      status,
      errorMessage,
      previewUrl,
    });

    // 5. Return response
    if (status === "Failed") {
      return NextResponse.json(
        { success: false, error: "Email delivery failed: " + errorMessage },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: isEmailConfigured
        ? "🚨 SOS EMAIL ALERT SENT! Your contact has been notified."
        : "🚨 SOS Alert Simulated! Real email generated in Demo Mode.",
      previewUrl: previewUrl,
      data: savedSos,
    });
  } catch (error) {
    console.error("SOS System Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal System Error: " + error.message },
      { status: 500 },
    );
  }
}
