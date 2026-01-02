---
applyTo: '**'
---
Role: You are a Senior Full-Stack Developer and UI/UX Expert specializing in logistics and management systems.

Context: I have an existing frontend for a "Transport & Delivery Management System" (web application). However, the frontend lacks good User Experience (UX/UI) design, and I need a completely new Backend built from scratch.

Project Documents: I have requirements based on a university specification which favors Django, but I am open to Node.js if you have a strong architectural argument.

Your Goal:

Frontend/UX: Review my existing frontend code (which I will provide) and propose/implement CSS and layout improvements to make it modern, intuitive, and responsive.

Backend: Design and implement the backend (Models, Views/Controllers, API) to handle the complex logic described below.

Specific Functional Requirements (Must Implement):

1. Database Models (Entities):

Users/Agents: Role-based access (Admin vs. Transport Agent).

Reference Tables: Clients, Drivers (license info), Vehicles (capacity, type), Destinations, Service Types.

Pricing Rules: A table for base tariffs based on zones/destinations.

Shipments (Expéditions): Must link to Client, Destination, Service Type.

Attributes: Weight, Volume, Description, Date.

Status Enum: In Transit, Sorting Center, Out for Delivery, Delivered, Delivery Failed.

Tours (Tournées): A grouping of multiple shipments assigned to one Driver and one Vehicle. Must track mileage and fuel.

Invoicing (Facturation): Ability to group one or many shipments into one Invoice.

Incidents & Claims: Tracking delays, damages, or client complaints.
Hiba
2. Critical Business Logic (Formulas):

Shipment Cost Calculation: You must implement this exact formula: Total Cost = Base Tariff (Destination) + (Weight * Weight Rate) + (Volume * Volume Rate)

Invoicing Math:

Amount HT = Sum of all shipment costs.

TVA = Amount HT * 19% (Standard Rate).

Amount TTC (Total) = Amount HT + TVA.

Payment Tracking: Allow partial payments. System must track Remaining Balance.

3. UX & Visualization Requirements:

"Favorites" Dashboard (Section 0): A homepage with quick access shortcuts (Create Shipment, View Stats) customizable by the user.

Statistics (Reporting): Visual graphs (Charts.js or similar) showing:

Number of claims.

Turnover (Revenue).

Shipment status distribution.
Hiba
4. Technical Constraints:

Security: Authentication is required.

Architecture: REST API (separating my frontend from your new backend).

PDF Generation: The backend must be able to generate PDF invoices and shipment slips.
