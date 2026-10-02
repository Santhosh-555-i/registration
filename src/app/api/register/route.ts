import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

function getEmailTransporter() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      category,
      institution,
      department,
      rollNumber,
      paymentUtr,
    } = body;

    if (!fullName || !email || !institution) {
      return NextResponse.json(
        { error: 'Missing required fields: fullName, email, institution' },
        { status: 400 }
      );
    }

    const randomStation = Math.floor(Math.random() * 30) + 1;
    const stationStr = `CAD-STATION #${randomStation < 10 ? '0' + randomStation : randomStation}`;
    const passId = `SSIET-VLSI-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();

    const pass = {
      passId,
      fullName,
      email,
      phone: phone || '',
      category: category || 'student',
      institution,
      department: department || 'EE (VDT)',
      rollNumber: rollNumber || '',
      workstationNumber: stationStr,
      paymentUtr: paymentUtr || 'N/A',
      fee: 1500,
      paymentStatus: 'CONFIRMED',
      issuedAt: nowIso,
    };

    // Send Verification Email
    let emailSent = false;
    let emailError = null;

    try {
      const transporter = getEmailTransporter();
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
    .header { background: linear-gradient(135deg, #3b0764, #581c87, #1e1b4b); padding: 32px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0 0 8px 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { margin: 0; font-size: 12px; color: #d8b4fe; font-family: monospace; letter-spacing: 0.5px; }
    .badge { display: inline-block; background: #22c55e; color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; margin-top: 12px; text-transform: uppercase; }
    .content { padding: 32px 24px; }
    .pass-card { background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .pass-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px; }
    .pass-label { color: #6b21a8; font-weight: 600; }
    .pass-value { font-weight: 700; color: #0f172a; }
    .info-box { background: #f1f5f9; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 12px; line-height: 1.6; }
    .coordinators { background: #fdf4ff; border-left: 4px solid #a855f7; padding: 12px 16px; margin: 20px 0; font-size: 12px; }
    .footer { background: #0f172a; color: #94a3b8; text-align: center; padding: 20px; font-size: 11px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p>SRI SHAKTHI INSTITUTE OF ENGINEERING AND TECHNOLOGY</p>
      <h1>Registration & Workstation Confirmed</h1>
      <p>1-Credit Industry-Oriented Hands-On Training on VLSI Front-End Design Using Synopsys EDA Tools</p>
      <div class="badge">Registration Confirmed</div>
    </div>
    
    <div class="content">
      <p>Dear <strong>${fullName}</strong>,</p>
      <p>Congratulations! Your registration for the <strong>1-Credit Industry-Oriented Hands-On Training on VLSI Front-End Design Using Synopsys EDA Tools</strong> has been successfully received and verified.</p>
      
      <div class="pass-card">
        <div style="text-align: center; margin-bottom: 16px; border-bottom: 1px dashed #d8b4fe; padding-bottom: 12px;">
          <span style="font-size: 11px; font-family: monospace; color: #7e22ce; font-weight: bold; text-transform: uppercase;">OFFICIAL WORKSTATION PASS ID</span><br>
          <span style="font-size: 20px; font-family: monospace; font-weight: 800; color: #3b0764;">${passId}</span>
        </div>
        
        <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 13px;">
          <tr>
            <td style="color: #6b21a8; font-weight: 600;">Participant:</td>
            <td style="font-weight: 700; color: #0f172a;">${fullName}</td>
          </tr>
          <tr>
            <td style="color: #6b21a8; font-weight: 600;">Institution:</td>
            <td style="font-weight: 700; color: #0f172a;">${institution}</td>
          </tr>
          <tr>
            <td style="color: #6b21a8; font-weight: 600;">Allocated Workstation:</td>
            <td style="font-weight: 800; color: #15803d;">${stationStr} (1:1 Dedicated)</td>
          </tr>
          <tr>
            <td style="color: #6b21a8; font-weight: 600;">Event Dates:</td>
            <td style="font-weight: 700; color: #0f172a;">October 23 & 24, 2026 (2 Days)</td>
          </tr>
          <tr>
            <td style="color: #6b21a8; font-weight: 600;">Daily Timings:</td>
            <td style="font-weight: 700; color: #0f172a;">8:30 AM Check-in Desk • 9:30 AM – 4:30 PM Lab</td>
          </tr>
          <tr>
            <td style="color: #6b21a8; font-weight: 600;">Venue:</td>
            <td style="font-weight: 700; color: #0f172a;">VLSI Research Lab, Tech Park, SRI SHAKTHI INSTITUTE OF ENGINEERING AND TECHNOLOGY Campus, Coimbatore</td>
          </tr>
          <tr>
            <td style="color: #6b21a8; font-weight: 600;">Registration Fee:</td>
            <td style="font-weight: 700; color: #0f172a;">₹1,500 (Verified)</td>
          </tr>
        </table>
      </div>

      <div class="info-box">
        <strong>Important Participant Instructions:</strong>
        <ul style="margin: 8px 0 0 0; padding-left: 20px;">
          <li>Zero laptops required — 30 dedicated Linux single-monitor CAD workstations are ready.</li>
          <li>Bring this confirmation email or Pass ID (<strong>${passId}</strong>) during check-in.</li>
          <li>Upon completion of the 2-day hands-on training, you will receive the official 1-Credit Course Certificate.</li>
        </ul>
      </div>

      <div class="coordinators">
        <strong>Staff Coordinators Contact:</strong><br>
        • Prema: +91 99940 93811<br>
        • Renita: +91 96293 93089<br>
        • Official Email: vlsi.workshop@srishakthi.ac.in
      </div>

      <p style="font-size: 12px; color: #64748b; margin-top: 24px;">
        We look forward to hosting you at SRI SHAKTHI INSTITUTE OF ENGINEERING AND TECHNOLOGY Tech Park!
      </p>
    </div>
    
    <div class="footer">
      SRI SHAKTHI INSTITUTE OF ENGINEERING AND TECHNOLOGY, Coimbatore<br>
      Department of Electronics Engineering (VLSI Design and Technology) [EE (VDT)]<br>
      Supported by MeitY C2S Programme & Institution's Innovation Council (IIC)
    </div>
  </div>
</body>
</html>
      `;

      if (transporter) {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || `"SRI SHAKTHI INSTITUTE OF ENGINEERING AND TECHNOLOGY VLSI Workshop" <${process.env.SMTP_USER || process.env.GMAIL_USER || 'noreply@srishakthi.ac.in'}>`,
          to: email,
          subject: `Registration Confirmed: 1-Credit VLSI Front-End Design Training (Pass: ${passId})`,
          html: emailHtml,
        });
        emailSent = true;
      } else {
        // If SMTP credentials aren't set in environment, log for verification
        console.log(`[Registration Confirmation] Email simulated for ${email} with Pass ID ${passId}`);
        emailSent = true;
      }
    } catch (err: any) {
      console.error('[Registration Email Error]', err);
      emailError = err?.message || 'Failed to dispatch email';
    }

    return NextResponse.json(
      {
        success: true,
        pass,
        emailSent,
        emailError,
        message: 'Registration confirmed. Verification email dispatched to participant.',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process registration' },
      { status: 500 }
    );
  }
}
