use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub fn render_latex(latex: &str) -> Result<String, String> {
    txm::render(latex)
        .map(|rendered| strip_sgr(&rendered))
        .map_err(|error| error.to_string())
}

fn strip_sgr(text: &str) -> String {
    let mut result = String::with_capacity(text.len());
    let mut chars = text.chars();

    while let Some(ch) = chars.next() {
        if ch == '\u{1b}' && chars.next() == Some('[') {
            for parameter in chars.by_ref() {
                if parameter == 'm' {
                    break;
                }
            }
        } else {
            result.push(ch);
        }
    }

    result
}

#[cfg(test)]
mod tests {
    use super::render_latex;

    #[test]
    fn renders_plain_unicode_grid() {
        let rendered = render_latex(r"\color{red}{\frac{a}{b}}").unwrap();
        assert_eq!(rendered, " a \n───\n b \n");
        assert!(!rendered.contains('\u{1b}'));
    }
}
