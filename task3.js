const takenNames = ["Arthas", "Gandalf", "Merlin", "Zeus", "Hero123"];
const MAX_SKILL_POINTS = 20;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("character-form");
    if (!form) return;

    form.noValidate = true;

    const nameInput = document.getElementById("char-name");
    const classSelect = document.getElementById("char-class");
    const skillInputs = document.querySelectorAll(".skill-input");
    const pointsLeftSpan = document.getElementById("points-left");
    const errorSummary = document.getElementById("error-summary");

    function updatePointsLeft() {
        let total = 0;
        skillInputs.forEach(input => {
            total += Number(input.value) || 0;
        });
        let left = MAX_SKILL_POINTS - total;
        if (pointsLeftSpan) pointsLeftSpan.textContent = left;
        return left;
    }

    function validateField(field) {
        let errorMsg = "";
        let errorContainer = document.getElementById(`${field.id}-error`);

        if (field === nameInput) {
            let val = nameInput.value.trim();
            if (val === "") {
                errorMsg = "Character name cannot be blank.";
            } else if (takenNames.includes(val)) {
                errorMsg = "This name is already taken! Choose another.";
            }
        } else if (field.classList.contains("skill-input")) {
            let val = Number(field.value);
            if (val < 1 || val > 10) {
                errorMsg = "Each skill must be between 1 and 10.";
            } else if (updatePointsLeft() < 0) {
                errorMsg = "Total skill points exceeded 20!";
            } else {
                let charClass = classSelect.value;
                if (charClass === "Mage" && field.id === "skill-magic" && val < 5) {
                    errorMsg = "Mages require at least 5 points in Magic!";
                }
            }
        }

        if (errorMsg) {
            field.setAttribute("aria-invalid", "true");
            if (errorContainer) errorContainer.textContent = errorMsg;
            return false;
        } else {
            field.setAttribute("aria-invalid", "false");
            if (errorContainer) errorContainer.textContent = "";
            return true;
        }
    }

    form.querySelectorAll("input, select").forEach(el => {
        el.addEventListener("blur", () => validateField(el));
        el.addEventListener("input", () => {
            updatePointsLeft();
            validateField(el);
        });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let firstInvalid = null;
        let errorCount = 0;

        form.querySelectorAll("input, select").forEach(el => {
            let isValid = validateField(el);
            if (!isValid) {
                errorCount++;
                if (!firstInvalid) firstInvalid = el;
            }
        });

        let pointsLeft = updatePointsLeft();
        if (pointsLeft !== 0) {
            errorCount++;
            alert(`You must use exactly 20 skill points! Current remaining: ${pointsLeft}`);
            if (!firstInvalid) firstInvalid = skillInputs[0];
        }

        if (errorCount > 0) {
            if (errorSummary) errorSummary.textContent = `Form has ${errorCount} errors. Please fix them below.`;
            if (firstInvalid) firstInvalid.focus();
        } else {
            if (errorSummary) errorSummary.textContent = "";
            alert("Character created successfully!");
            form.reset();
            updatePointsLeft();
        }
    });
});