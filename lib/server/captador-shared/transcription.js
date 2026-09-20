"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WHISPER_DOMAIN_PROMPT = exports.applyPhraseCorrections = exports.normalizeVoiceToJoseCommand = exports.normalizeVoiceToAlfredoCommand = exports.normalizeSpokenText = exports.PHRASE_CORRECTIONS = exports.WHISPER_ALFREDO_PROMPT = exports.WHISPER_JOSE_PROMPT = void 0;
exports.applyTranscriptionCorrections = applyTranscriptionCorrections;
exports.normalizeVoiceToCommand = normalizeVoiceToCommand;
exports.transcribeWithGroq = transcribeWithGroq;
exports.transcribeAndCorrect = transcribeAndCorrect;
exports.transcribeAlfredo = transcribeAlfredo;
const transcription_dictionary_1 = require("./transcription-dictionary");
Object.defineProperty(exports, "WHISPER_JOSE_PROMPT", { enumerable: true, get: function () { return transcription_dictionary_1.WHISPER_JOSE_PROMPT; } });
Object.defineProperty(exports, "WHISPER_ALFREDO_PROMPT", { enumerable: true, get: function () { return transcription_dictionary_1.WHISPER_ALFREDO_PROMPT; } });
const voice_normalize_1 = require("./voice-normalize");
Object.defineProperty(exports, "PHRASE_CORRECTIONS", { enumerable: true, get: function () { return voice_normalize_1.PHRASE_CORRECTIONS; } });
var voice_normalize_2 = require("./voice-normalize");
Object.defineProperty(exports, "normalizeSpokenText", { enumerable: true, get: function () { return voice_normalize_2.normalizeSpokenText; } });
Object.defineProperty(exports, "normalizeVoiceToAlfredoCommand", { enumerable: true, get: function () { return voice_normalize_2.normalizeVoiceToAlfredoCommand; } });
Object.defineProperty(exports, "normalizeVoiceToJoseCommand", { enumerable: true, get: function () { return voice_normalize_2.normalizeVoiceToJoseCommand; } });
Object.defineProperty(exports, "applyPhraseCorrections", { enumerable: true, get: function () { return voice_normalize_2.applyPhraseCorrections; } });
exports.WHISPER_DOMAIN_PROMPT = transcription_dictionary_1.WHISPER_JOSE_PROMPT;
/** @deprecated Usar applyPhraseCorrections */
function applyTranscriptionCorrections(text) {
    return (0, voice_normalize_1.applyPhraseCorrections)(text);
}
/** Convierte texto hablado en comando operador reconocible (José). */
function normalizeVoiceToCommand(text) {
    return (0, voice_normalize_1.normalizeVoiceToJoseCommand)(text);
}
async function transcribeWithGroq(audio, filename, opts = {}) {
    const apiKey = opts.apiKey ?? process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("GROQ_API_KEY no configurada");
    }
    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(audio)]), filename);
    form.append("model", opts.model ?? process.env.GROQ_WHISPER_MODEL ?? "whisper-large-v3");
    form.append("language", opts.language ?? "es");
    form.append("temperature", "0");
    form.append("response_format", "json");
    form.append("prompt", opts.prompt ?? exports.WHISPER_DOMAIN_PROMPT);
    const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form,
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Groq Whisper error ${res.status}: ${err}`);
    }
    const data = (await res.json());
    return data.text?.trim() ?? "";
}
async function transcribeAndCorrect(audio, filename, opts) {
    const raw = await transcribeWithGroq(audio, filename, opts);
    const corrected = (0, voice_normalize_1.applyPhraseCorrections)(raw);
    const command = (0, voice_normalize_1.normalizeVoiceToJoseCommand)(raw);
    return { raw, corrected, command };
}
async function transcribeAlfredo(audio, filename, opts) {
    const raw = await transcribeWithGroq(audio, filename, {
        ...opts,
        prompt: opts?.prompt ?? transcription_dictionary_1.WHISPER_ALFREDO_PROMPT,
    });
    const corrected = (0, voice_normalize_1.applyPhraseCorrections)(raw);
    const command = (0, voice_normalize_1.normalizeVoiceToAlfredoCommand)(raw);
    return { raw, corrected, command };
}
