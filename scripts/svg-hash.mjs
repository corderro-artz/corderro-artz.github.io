// The hash of an SVG source, shared by the renderer that records it and the
// check that verifies it, so the two cannot drift apart.
//
// It is taken over the text with line endings normalised, not over the raw
// bytes. git stores these files with LF and checks them out with CRLF wherever
// core.autocrlf is on, which is every Windows clone by default — so a hash
// recorded on Windows never matches the same file on a Linux runner. That is
// not a hypothetical: the palette gate was added with Windows-recorded hashes
// and failed all sixteen sources the first time it ran in CI.
//
// Normalising is also the honest comparison. The hash exists to answer one
// question — has this source moved on from the PNG rendered out of it? — and a
// line ending changes nothing the renderer draws. A gate that fires on it is
// reporting a difference that does not exist.
import { createHash } from 'node:crypto';

/** @param {Buffer|string} source The SVG file's contents. */
export const svgHash = (source) =>
  createHash('sha256')
    .update(String(source).replace(/\r\n/g, '\n'), 'utf8')
    .digest('hex');
