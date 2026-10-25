# Differentiation — Complete Beginner-Friendly Notes

These notes explain differentiation and the notation \(\frac{dy}{dx}\) step by step, with formulas and worked examples.

## 1. What does \(\frac{dy}{dx}\) mean?

Suppose

\[
y=x^2
\]

Here, \(y\) depends on \(x\). When \(x\) changes, \(y\) changes too.

\[
\boxed{\frac{dy}{dx}=\text{derivative of }y\text{ with respect to }x}
\]

In simple words, it tells us how quickly \(y\) changes when \(x\) changes.

These notations mean the same thing:

- \(\frac{dy}{dx}\): derivative of \(y\) with respect to \(x\)
- \(y'\): derivative of \(y\)
- \(f'(x)\): derivative of the function \(f(x)\)
- \(\frac{d}{dx}\): differentiate with respect to \(x\)

**Important:** \(\frac{dy}{dx}\) is notation for a derivative.

## 2. Basic rules of differentiation

### Rule 1: Derivative of a constant

\[
\frac{d}{dx}(5)=0
\]

The derivative of any constant number is zero.

Examples:

\[
\frac{d}{dx}(7)=0,\qquad \frac{d}{dx}(100)=0
\]

### Rule 2: Derivative of \(x\)

\[
\frac{d}{dx}(x)=1
\]

### Rule 3: Power rule

\[
\boxed{\frac{d}{dx}(x^n)=nx^{n-1}}
\]

**Shortcut:** Bring the power down in front, then subtract \(1\) from the power.

Example:

\[
\begin{aligned}
\frac{d}{dx}(x^4)&=4x^{4-1}\\
&=4x^3
\end{aligned}
\]

### Rule 4: A constant multiplied by a power

\[
\frac{d}{dx}(ax^n)=anx^{n-1}
\]

Example:

\[
\frac{d}{dx}(3x^2)=3(2)x=6x
\]

## 3. Differentiation of sums and differences

Differentiate each term separately.

### Example 1

\[
y=x^3+x^2+x+5
\]

\[
\begin{aligned}
\frac{dy}{dx}
&=3x^2+2x+1+0\\
&=\boxed{3x^2+2x+1}
\end{aligned}
\]

### Example 2

\[
y=4x^3-2x^2+7
\]

\[
\boxed{\frac{dy}{dx}=12x^2-4x}
\]

Remember:

- Plus signs remain plus signs.
- Minus signs remain minus signs.
- Constants disappear because their derivative is zero.

## 4. Important standard derivatives

| Function | Derivative |
|---|---|
| \(c\), a constant | \(0\) |
| \(x\) | \(1\) |
| \(x^2\) | \(2x\) |
| \(x^3\) | \(3x^2\) |
| \(x^n\) | \(nx^{n-1}\) |
| \(e^x\) | \(e^x\) |
| \(e^{ax}\) | \(ae^{ax}\) |
| \(\sin x\) | \(\cos x\) |
| \(\cos x\) | \(-\sin x\) |
| \(\tan x\) | \(\sec^2 x\) |
| \(\ln x\) | \(\frac{1}{x}\) |

For trigonometric derivatives, angles are measured in radians.

**Special point:** The derivative of \(e^x\) is \(e^x\) itself. It does not become \(xe^{x-1}\).

## 5. The product rule

Use the product rule whenever **two functions are multiplied together**.

\[
\boxed{\frac{d}{dx}(uv)=u\frac{dv}{dx}+v\frac{du}{dx}}
\]

Remember: **First × derivative of second + second × derivative of first.**

### Example: \(y=xe^x\)

Step 1: Identify the two parts.

\[
u=x,\qquad v=e^x
\]

Step 2: Differentiate each part.

\[
\frac{du}{dx}=1,\qquad \frac{dv}{dx}=e^x
\]

Step 3: Apply the product rule.

\[
\begin{aligned}
\frac{dy}{dx}
&=x(e^x)+e^x(1)\\
&=xe^x+e^x
\end{aligned}
\]

Step 4: Take \(e^x\) common.

\[
\boxed{\frac{dy}{dx}=e^x(x+1)}
\]

### When do you use the product rule?

- \(xe^x\): yes
- \(x^2\sin x\): yes
- \(x^3\cos x\): yes
- \(x^3+x^2\): no; differentiate each term separately.

## 6. The chain rule

Use the chain rule when one function is inside another function.

\[
\boxed{\frac{d}{dx}[f(g(x))]=f'(g(x))g'(x)}
\]

In simple terms: **Differentiate the outside, keep the inside, then multiply by the derivative of the inside.**

### Example 1

\[
y=(2x+1)^3
\]

Differentiate the outside power:

\[
3(2x+1)^2
\]

Differentiate the inside:

\[
\frac{d}{dx}(2x+1)=2
\]

Multiply:

\[
\begin{aligned}
\frac{dy}{dx}&=3(2x+1)^2(2)\\
&=\boxed{6(2x+1)^2}
\end{aligned}
\]

### Example 2

\[
y=e^{3x}
\]

The derivative of the inside \(3x\) is \(3\), so

\[
\boxed{\frac{dy}{dx}=3e^{3x}}
\]

## 7. The quotient rule

Use this when one function is divided by another function.

\[
\boxed{\frac{d}{dx}\left(\frac{u}{v}\right)=\frac{v\frac{du}{dx}-u\frac{dv}{dx}}{v^2}}
\]

Remember: **Bottom × derivative of top − top × derivative of bottom, all divided by bottom squared.**

### Example

\[
y=\frac{x^2}{x+1}
\]

Let

\[
u=x^2,\qquad v=x+1
\]

Then

\[
\frac{du}{dx}=2x,\qquad \frac{dv}{dx}=1
\]

Apply the formula:

\[
\begin{aligned}
\frac{dy}{dx}
&=\frac{(x+1)(2x)-x^2(1)}{(x+1)^2}\\
&=\frac{2x^2+2x-x^2}{(x+1)^2}
\end{aligned}
\]

Final answer:

\[
\boxed{\frac{dy}{dx}=\frac{x^2+2x}{(x+1)^2}}
\]

## 8. How to choose the correct rule

| Type of expression | Rule | Example |
|---|---|---|
| Terms added or subtracted | Differentiate each term | \(x^2+e^x\) |
| Two functions multiplied | Product rule | \(xe^x\) |
| One function divided by another | Quotient rule (or simplify first) | \(\frac{x^2}{e^x}\) |
| One function inside another | Chain rule | \((x^2+1)^3\) |

## 9. Common mistakes to avoid

- \(\frac{d}{dx}(x^3)=3x^2\), **not** \(3x^3\).
- \(\frac{d}{dx}(e^x)=e^x\), **not** \(xe^{x-1}\).
- \(\frac{d}{dx}(5)=0\), **not** \(1\).
- \(\frac{d}{dx}(\cos x)=-\sin x\); remember the negative sign.
- In the product rule, do not differentiate only one factor.
- In the chain rule, do not forget to multiply by the derivative of the inside function.
- In the quotient rule, the numerator order is bottom × derivative of top **minus** top × derivative of bottom.

## 10. Practice questions

Try these before checking the answers.

1. If \(y=x^4\), find \(\frac{dy}{dx}\).
2. If \(y=3x^2+5x+7\), find \(\frac{dy}{dx}\).
3. If \(y=e^x\), find \(\frac{dy}{dx}\).
4. If \(y=xe^x\), which rule should you use?
5. If \(y=(2x+1)^2\), find \(\frac{dy}{dx}\).

### Answers

1. \(\frac{dy}{dx}=4x^3\)
2. \(\frac{dy}{dx}=6x+5\)
3. \(\frac{dy}{dx}=e^x\)
4. Product rule
5. \(\frac{dy}{dx}=4x+2\)

## Study advice

Learn the power rule, standard derivatives, and product rule first. Practise those until you can solve them without looking at the notes, then move on to the chain rule and quotient rule. You do not need to master everything in one sitting.
