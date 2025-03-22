import SwiftUI

struct ModernButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .padding(.horizontal, 20)
            .padding(.vertical, 12)
            .background(
                Group {
                    if configuration.isPressed {
                        Color(DesignSystem.Colors.primary)
                            .opacity(0.8)
                    } else {
                        Color(DesignSystem.Colors.primary)
                    }
                }
            )
            .foregroundColor(.white)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.spring(response: 0.3, dampingFraction: 0.6), value: configuration.isPressed)
            .shadow(
                color: Color(DesignSystem.Colors.primary).opacity(0.3),
                radius: configuration.isPressed ? 4 : 8,
                x: 0,
                y: configuration.isPressed ? 2 : 4
            )
    }
}

extension View {
    func modernButtonStyle() -> some View {
        self.buttonStyle(ModernButtonStyle())
    }
}
