"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePhone = normalizePhone;
exports.nextAssignee = nextAssignee;
exports.gestorDisplayName = gestorDisplayName;
exports.fillTemplate = fillTemplate;
exports.randomDelayMs = randomDelayMs;
exports.isWithinSendWindow = isWithinSendWindow;
function normalizePhone(raw) {
    const digits = raw.replace(/\D/g, "");
    if (digits.length === 9 && /^[67]/.test(digits)) {
        return `+34${digits}`;
    }
    if (digits.length === 11 && digits.startsWith("34")) {
        return `+${digits}`;
    }
    if (digits.length >= 10 && raw.startsWith("+")) {
        return `+${digits}`;
    }
    return null;
}
function nextAssignee(last) {
    if (!last || last === "daniel")
        return "juan";
    return "daniel";
}
function gestorDisplayName(assignee) {
    return assignee === "juan" ? "Juan" : "Daniel";
}
function fillTemplate(template, vars) {
    return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
}
function randomDelayMs(minSec, maxSec) {
    const sec = minSec + Math.random() * (maxSec - minSec);
    return Math.round(sec * 1000);
}
function isWithinSendWindow(start, end, timezone = "Europe/Madrid") {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
    const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
    const current = `${hour}:${minute}`;
    return current >= start && current <= end;
}
