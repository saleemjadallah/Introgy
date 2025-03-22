import SwiftUI

struct AnimatedCardViewRepresentable: UIViewRepresentable {
    var title: String
    var subtitle: String
    var iconName: String
    
    func makeUIView(context: Context) -> AnimatedCardView {
        let cardView = AnimatedCardView()
        updateUIView(cardView, context: context)
        return cardView
    }
    
    func updateUIView(_ cardView: AnimatedCardView, context: Context) {
        cardView.title = title
        cardView.subtitle = subtitle
        cardView.iconName = iconName
        cardView.applyFloatingAnimation()
    }
}

// Extension for SwiftUI previews
struct AnimatedCardViewRepresentable_Previews: PreviewProvider {
    static var previews: some View {
        AnimatedCardViewRepresentable(
            title: "Preview Card",
            subtitle: "This is a preview of the animated card",
            iconName: "star.fill"
        )
        .frame(height: 180)
        .padding()
    }
}
